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
function getImageDimensions(src, id, cb) {
    var img = new Image();
    img.onload = function() {
        cb(id, this.width, this.height)
    }
    img.src = src;
}

var ImageGrid = React.createClass({
    getInitialState: function() {
        var state = {
            containerWidth: 500,
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
    componentDidMount: function() {
        _.each(this.state.imagesToShow, function(image, index) {
            // getImageDimensions(image.path, image.id, this.recalculateGrid);
        }, this);

        this.setState({containerWidth: this.getDOMNode().offsetWidth});

        // $(this.getDOMNode()).resize(this.onResize);
        // elementResizeEvent(this.getDOMNode(), this.onResize);
    },
    // Throttle updates to 60 FPS.
    onResize: _.throttle(function() {
        this.setState({containerWidth: this.getDOMNode().offsetWidth});
    }, 16.666),
    handleImageClick: function handleImageClick(imageId, event) {
        this.props.onImageClick && this.props.onImageClick(imageId);
    },
    recalculateGrid: function(id, width, height) {
        var _imagesToShow = _.clone(this.state.imagesToShow);

        var imageIndex = _.findIndex(_imagesToShow, {id: id});
        _imagesToShow[imageIndex].width = width;
        _imagesToShow[imageIndex].height = height;

        // if all the images have width and height, we can rotate the array around the image with max height, so that the first image has the max height and can be displayed properly on the left side
        if(_.all(_imagesToShow, function(image) { return image.width && image.height;})) {
            var indexForMaxHeightImage = _.findIndex(_imagesToShow, _.max(_imagesToShow, function(image) {
                return image.height;
            }));

            console.log('index for image with max height: ', indexForMaxHeightImage, _.max(_imagesToShow, function(image) {
                return image.height;
            }));
        }

        this.setState({
            imagesToShow: _imagesToShow
        });
    },
    getComponentStyles: function(images) {
        var numberOfImages = images.length;
        var smallestHeightRaw = Math.floor(this.state.containerWidth/(numberOfImages - 1));
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
            if(images[0].width > images[0].height) {
                styles = [
                    {
                        width: Math.min(this.state.containerWidth, images[0].width) - margin,
                        height: Math.min(this.state.containerWidth, images[0].width)*images[0].height/images[0].width,
                        'margin': margin
                    }
                ];
            } else {
                styles = [
                    {
                        width: Math.min(this.state.containerWidth, images[0].height)*images[0].width/images[0].height,
                        height: Math.min(this.state.containerWidth, images[0].height) - margin,
                        'margin': margin
                    }
                ];
            }
        } else if(numberOfImages === 2) {
            styles = [
                {
                    width: Math.min(smallImageHeight/2)-margin,
                    height: this.state.containerWidth-margin,
                    'margin-right': margin
                },
                {
                    width: Math.min(smallImageHeight/2)-margin,
                    height: this.state.containerWidth-margin,
                    'margin-bottom': margin
                },
            ];
        } else {
            styles = [
                {
                    width: smallImageHeight*(numberOfImages-2),
                    height: this.state.containerWidth-margin,
                    'margin-right': margin
                }
            ];

            for(var i = 1; i < numberOfImages && i < 4; i++) {
                styles.push({
                    width: smallImageHeight-5,
                    height: smallImageHeight,
                    'margin-bottom': margin
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

            if(image.width && image.height && image.width < image.height) {
                imageStyle = {
                    maxWidth: componentStyle.width,
                };
            } else {
                imageStyle = {
                    maxHeight: componentStyle.height,
                };
            }

            // if(index === 0) {
            //     imageStyle = {
            //         minHeight: this.state.containerWidth
            //     };
            // }

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
            <div  style={{'background-color': 'white'}}>
                {images}
                <div style={{'clear': 'both'}} />
            </div>
        );
    }
});

module.exports = ImageGrid;