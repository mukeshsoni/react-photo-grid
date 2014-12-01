/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');

/* Acceptance Criteria
 * 1. Given 2 or more images show them in a square grid
 * 2. If only one image is given
 *        and 2.1 the height of image is greater than width - show in same square grid with height of grid = min(gridHeight, photoHeight)
 *      or 2.2 the width of image is greater than it's height - widthOfGrid = gridWidth, heightOfGrid = widthOfGrid*photoHeight/photoWidth
                but if photoWidth < gridWidth - photowidth within grid is equal to the photo width
 * 3. If 2 images are supplied
 *
 */

// TODO - element resize event is not working
// TODO - allow user to send a grid size
var imageElements = [];

function imageLoadCallback(id, callback) {
    return function(e) {
        callback(id, this.naturalWidth, this.naturalHeight);
    }
}

function getImageDimensions(src, id, cb) {
    var img = new Image();
    img.id = id;
    imageElements.push(img);
    img.addEventListener('load', imageLoadCallback(id, cb));

    img.src = src;
}

var ImageGrid = React.createClass({
    propTypes: {
        gridSize: React.PropTypes.string
    },
    getInitialState: function() {
        var containerWidth=500, containerHeight=500;

        if(this.props.gridSize) {
            var container = this.props.gridSize.split('x');
            containerWidth = container[0] || 500;
            containerHeight = container[1] || 500;
        }

        var state = {
            ladyLuck: Math.floor(Math.random()*2),
            containerWidth: containerWidth,
            containerHeight: containerHeight,
            imagesToShow: this.props.data.length <= 4 ? this.props.data : _.first(this.props.data, 4)
        };

        if(this.props.containerWidth) {
            state.containerWidth = this.props.containerWidth;
        }

        return state;
    },
    getDefaultProps: function() {
        return {
            data: []
        };
    },
    componentWillUnmount: function() {
        _.each(imageElements, function(imageElement) {
            imageElement.removeEventListener('load', imageLoadCallback(imageElement.id, this.recalculateGrid));
        });
    },
    componentDidMount: function() {
        _.each(this.state.imagesToShow, function(image, index) {
            getImageDimensions(image.path, image.id, this.recalculateGrid);
        }, this);

        // only set it to parents width/height if no gridsize is provided
        if(!this.props.gridSize) {
            this.setState({
                containerWidth: this.getDOMNode().offsetWidth,
                containerHeight: this.getDOMNode().offsetWidth
            });
        }

        // $(this.getDOMNode()).resize(this.onResize);
        // elementResizeEvent(this.getDOMNode(), this.onResize);
    },
    // Throttle updates to 60 FPS.
    onResize: _.throttle(function() {
        this.setState({
            containerWidth: this.getDOMNode().offsetWidth,
            containerHeight: this.getDOMNode().offsetWidth
        });
    }, 16.666),
    handleImageClick: function handleImageClick(imageId, event) {
        this.props.onImageClick && this.props.onImageClick(imageId);
    },
    recalculateGrid: function(id, width, height) {
        var _imagesToShow = _.clone(this.state.imagesToShow);

        var imageIndex = _.findIndex(_imagesToShow, {id: id});
        _imagesToShow[imageIndex].width = width;
        _imagesToShow[imageIndex].height = height;
        var indexForMaxHeightImage = 0;
        var containerHeight = this.state.containerHeight;

        // if all the images have width and height, we can rotate the array around the image with max height,
        // so that the first image has the max height and can be displayed properly on the left side
        if(_.all(_imagesToShow, function(image) { return image.width && image.height;})) {
            // TODO - the logic should not only look the the image with max height but with height >= containerHeight and max(height/width ratio)

            indexForMaxHeightImage = _.findIndex(_imagesToShow, _.max(_imagesToShow, function(image) {
                return image.height;
            }));

            if(_imagesToShow[indexForMaxHeightImage].height < containerHeight) {
                containerHeight = _imagesToShow[indexForMaxHeightImage].height;
            }

            var indexForBestVerticalImage = _.reduce(_imagesToShow, function(result, image, index) {
                if(image.height >= containerHeight && (image.height/image.width) > (_imagesToShow[result].height/_imagesToShow[result].width)) {
                    return index;
                }
                return result;
            }, 0);

            _imagesToShow.push.apply(_imagesToShow, _imagesToShow.splice(0, indexForBestVerticalImage));
            this.setState({
                imagesToShow: _imagesToShow,
                containerHeight: containerHeight
            });
        }
    },
    getComponentStyles: function(images) {
        var numberOfImages = images.length;
        
        var marginSetters = ['Bottom', 'Right'];
        var contenders = ['Width', 'Height'];
        var winner = contenders[this.state.ladyLuck];
        var loser = _.first(_.without(contenders, winner));
        var marginWinner = marginSetters[this.state.ladyLuck];
        var marginLoser = _.first(_.without(marginSetters, marginWinner));

        var smallestDimensionRaw = Math.floor(this.state['container' + winner]/(numberOfImages - 1));
        var margin = 2;
        var smallImageDimension = smallestDimensionRaw - margin;
        var styles = [];
        var commonStyle = {
            display: 'inline-block',
            position: 'relative',
            overflow: 'hidden',
            float: 'left',
            verticalAlign: 'top',
            cursor: 'pointer'
        };

        switch(numberOfImages) {
            case 0: 
                break;
            case 1:
                // set some big numbers in case width and height not provided
                if(!images[0].width) images[0].width = 1000000;
                if(!images[0].height) images[0].height = 1000000;

                if(images[0].width > images[0].height) {
                    styles = [
                        {
                            width: Math.min(this.state.containerWidth, images[0].width) - margin,
                            height: Math.min(this.state.containerWidth, images[0].width)*images[0].height/images[0].width - margin,
                            margin: margin
                        }
                    ];
                } else {
                    styles = [
                        {
                            width: Math.min(this.state.containerHeight, images[0].height)*images[0].width/images[0].height - margin,
                            height: Math.min(this.state.containerHeight, images[0].height) - margin,
                            margin: margin
                        }
                    ];
                }
                break;
            case 2:
                styles = [
                    {
                        width: Math.min(smallImageDimension/2)-margin,
                        height: this.state.containerHeight-margin,
                        marginRight: margin
                    },
                    {
                        width: Math.min(smallImageDimension/2)-margin,
                        height: this.state.containerHeight-margin,
                        marginBottom: margin
                    },
                ];
                break;
            default:
                styles[0] = {};
                styles[0][winner.toLowerCase()] = this.state['container'+winner]-margin;
                styles[0][loser.toLowerCase()] = smallImageDimension*(numberOfImages-2);
                styles[0]['margin'+marginWinner] = margin;
                var styleForSmallerImages = {
                    width: smallImageDimension,
                    height: smallImageDimension,
                };
                styleForSmallerImages['margin'+marginLoser] = margin;

                for(var i = 1; i < numberOfImages && i < 4; i++) {
                    styles.push(styleForSmallerImages);
                }
        }

        return _.map(styles, function(style) {
            return _.defaults(style, commonStyle);
        });;
    },
    render: function() {
        var componentStyles = this.getComponentStyles(this.state.imagesToShow);

        var images = this.state.imagesToShow.map(function(image, index){
            var componentStyle = componentStyles[index];

            // max width and height has to be dynamic depending on this image's dimensions
            var imageStyle;

            if(image.width && image.height) {
                if(image.width <= componentStyle.width || image.height <= componentStyle.height) {
                    // do nothing
                } else if((image.width/componentStyle.width) < (image.height/componentStyle.height)) {
                    imageStyle = {
                        maxWidth: componentStyle.width,
                    };
                } else {
                    imageStyle = {
                        maxHeight: componentStyle.height,
                    };
                }
            }

            return (
                <div key={'image_'+index} style={componentStyle}>
                  <img
                    style={imageStyle}
                    src={image.path}
                    onClick={this.handleImageClick.bind(this, image.id)} />
                </div>
            );
        }, this);

        var containerStyle = {
            width: this.state.containerWidth,
            height: this.state.containerWidth,
            backgroundColor: 'white'
        };
// the outer div is needed so that container width can be recalculated based on the parent container width (which the outer div inherits
// the div inside the outer div is assigned a width in the first render itself. so that doesn't work out while trying to reset container width
        return (
            <div>
                <div style={containerStyle}>
                    {images}
                    <div style={{'clear': 'both'}} />
                </div>
            </div>
        );
    }
});

module.exports = ImageGrid;