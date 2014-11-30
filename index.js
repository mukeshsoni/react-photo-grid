/** @jsx React.DOM */

var _ = require('lodash');
var React = require('react');

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

        if(numberOfImages === 1) {
            return [
                {
                    width: Math.min(this.state.containerWidth, images[0].width),
                    height: Math.min(this.state.containerWidth, images[0].height),
                    display: 'inline-block',
                    position: 'relative',
                    overflow: 'hidden',
                    'margin': margin,
                    float: 'left',
                    verticalAlign: 'top',
                    cursor: 'pointer'
              }
          ];
        }

        if(numberOfImages === 2) {
            return [
                {
                    width: Math.min(smallImageHeight/2)-margin,
                    height: this.state.containerWidth-margin,
                    display: 'inline-block',
                    position: 'relative',
                    overflow: 'hidden',
                    'margin-right': margin,
                    float: 'left',
                    verticalAlign: 'top',
                    cursor: 'pointer'
                },
                {
                    width: Math.min(smallImageHeight/2)-margin,
                    height: this.state.containerWidth-margin,
                    display: 'inline-block',
                    position: 'relative',
                    overflow: 'hidden',
                    'margin-bottom': margin,
                    float: 'left',
                    verticalAlign: 'top',
                    cursor: 'pointer'
                },
            ];
        }

        if(numberOfImages === 3) {
            return [
                {
                    width: smallImageHeight*(numberOfImages-2),
                    height: this.state.containerWidth-margin,
                    display: 'inline-block',
                    position: 'relative',
                    overflow: 'hidden',
                    'margin-right': margin,
                    float: 'left',
                    verticalAlign: 'top',
                    cursor: 'pointer'
                },
                {
                    width: smallImageHeight-5,
                    height: smallImageHeight,
                    display: 'inline-block',
                    position: 'relative',
                    overflow: 'hidden',
                    'margin-bottom': margin,
                    float: 'left',
                    verticalAlign: 'top',
                    cursor: 'pointer'
                },
                {
                    width: smallImageHeight-5,
                    height: smallImageHeight,
                    'margin-bottom': margin,
                    display: 'inline-block',
                    position: 'relative',
                    overflow: 'hidden',
                    float: 'left',
                    verticalAlign: 'top',
                    cursor: 'pointer'
                }
            ];
        }

        return [
            {
                width: smallestHeightRaw*(numberOfImages-2),
                height: this.state.containerWidth-margin,
                display: 'inline-block',
                position: 'relative',
                overflow: 'hidden',
                'margin-right': margin,
                float: 'left',
                verticalAlign: 'top',
                cursor: 'pointer'
            },
            {
                width: smallImageHeight-5,
                height: smallImageHeight,
                display: 'inline-block',
                position: 'relative',
                overflow: 'hidden',
                'margin-bottom': margin,
                float: 'left',
                verticalAlign: 'top',
                cursor: 'pointer'
            },
            {
                width: smallImageHeight-5,
                height: smallImageHeight,
                'margin-bottom': margin,
                display: 'inline-block',
                position: 'relative',
                overflow: 'hidden',
                float: 'left',
                verticalAlign: 'top',
                cursor: 'pointer'
            },
            {
                width: smallImageHeight-5,
                height: smallImageHeight,
                'margin-bottom': margin,
                display: 'inline-block',
                position: 'relative',
                overflow: 'hidden',
                float: 'left',
                verticalAlign: 'top',
                cursor: 'pointer'
            }
        ];
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

            if(index === 0) {
                imageStyle = {
                    minHeight: this.state.containerWidth
                };
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
            <div  style={{'background-color': 'white'}}>
                {images}
                <div style={{'clear': 'both'}} />
            </div>
        );
    }
});

module.exports = ImageGrid;