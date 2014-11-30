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

var imageElements = [];

function imageLoadCallback(id, callback) {
    return function(e) {
        console.log('event: ', e.path[0].naturalWidth);
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
    getInitialState: function() {
        var state = {
            containerWidth: 500,
            containerHeight: 500,
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

        this.setState({
            containerWidth: this.getDOMNode().offsetWidth,
            containerHeight: this.getDOMNode().offsetWidth
        });

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
    // TODO - if the height of all the images is less than the grid height (container height), change the container height and width
    recalculateGrid: function(id, width, height) {
        var _imagesToShow = _.clone(this.state.imagesToShow);

        var imageIndex = _.findIndex(_imagesToShow, {id: id});
        _imagesToShow[imageIndex].width = width;
        _imagesToShow[imageIndex].height = height;
        var indexForMaxHeightImage = 0;
        var containerHeight = this.state.containerHeight;

        // if all the images have width and height, we can rotate the array around the image with max height, so that the first image has the max height and can be displayed properly on the left side
        if(_.all(_imagesToShow, function(image) { return image.width && image.height;})) {
            indexForMaxHeightImage = _.findIndex(_imagesToShow, _.max(_imagesToShow, function(image) {
                return image.height;
            }));

            console.log('index for image with max height: ', indexForMaxHeightImage, _.max(_imagesToShow, function(image) {
                return image.height;
            }));
            console.log('max height image height: ', _imagesToShow[indexForMaxHeightImage].height);
            if(_imagesToShow[indexForMaxHeightImage].height < containerHeight) {
                containerHeight = _imagesToShow[indexForMaxHeightImage].height;
            }

            _imagesToShow.push.apply(_imagesToShow, _imagesToShow.splice(0, indexForMaxHeightImage));
            this.setState({
                imagesToShow: _imagesToShow,
                containerHeight: containerHeight
            });
        }


    },
    getComponentStyles: function(images) {
        var numberOfImages = images.length;
        var smallestHeightRaw = Math.floor(this.state.containerHeight/(numberOfImages - 1));
        var margin = 2;
        var smallImageHeight = smallestHeightRaw - margin;
        var styles = [];
        var commonStyle = {
            display: 'inline-block',
            position: 'relative',
            overflow: 'hidden',
            float: 'left',
            verticalAlign: 'top',
            cursor: 'pointer'
        };

        if(numberOfImages < 1) return styles;

        if(numberOfImages === 1) {
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
        } else if(numberOfImages === 2) {
            styles = [
                {
                    width: Math.min(smallImageHeight/2)-margin,
                    height: this.state.containerHeight-margin,
                    marginRight: margin
                },
                {
                    width: Math.min(smallImageHeight/2)-margin,
                    height: this.state.containerHeight-margin,
                    marginBottom: margin
                },
            ];
        } else {
            styles = [
                {
                    width: smallImageHeight*(numberOfImages-2),
                    height: this.state.containerHeight-margin,
                    marginRight: margin
                }
            ];

            for(var i = 1; i < numberOfImages && i < 4; i++) {
                styles.push({
                    width: smallImageHeight-5,
                    height: smallImageHeight,
                    marginBottom: margin
                });
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
            height: this.state.containerWidth
        };

        return (
            <div  style={{backgroundColor: 'white'}}>
                {images}
                <div style={{'clear': 'both'}} />
            </div>
        );
    }
});

module.exports = ImageGrid;