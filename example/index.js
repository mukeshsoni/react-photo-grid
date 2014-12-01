var _ = require('lodash');
var React = require('react');
var ReactImageGrid = require('../');

function handleImageClick(image) {
    console.log('Image clicked. Show it in a nice lightbox?');
}

var feelingLucky = Math.floor(Math.random()*2);
var luckType = ['', 'nightlife', 'animals', 'city', 'people', 'nature', 'sports', 'cats', 'transport'];
var imageData;

if(feelingLucky || true) {
    var luckTypeSelector = luckType[Math.floor(Math.random()*luckType.length)];
    imageData = [
        {path: 'http://lorempixel.com/600/500/'+luckTypeSelector },
        {path: 'http://lorempixel.com/400/400/'+luckTypeSelector },
        {path: 'http://lorempixel.com/500/700/'+luckTypeSelector },
        {path: 'http://lorempixel.com/600/800/'+luckTypeSelector }
    ];
} else { // for testing
    imageData = [
        {path: 'http://placehold.it/400x400'},
        {path: 'http://placehold.it/500x700'},
        {path: 'http://placehold.it/600x500'},
        {path: 'http://placehold.it/600x800'}
    ];
}

if(window.navigator.onLine === false) {
    imageData = [
        {path: 'images/1.jpg'},
        {path: 'images/2.jpg'},
        {path: 'images/3.jpg'},
        {path: 'images/4.jpg'}
    ];
}

imageData = _.first(imageData, 4);

// let's convert the data into a array of path strings
imageData = _.pluck(imageData, 'path');

var imageGrid = (
            <ReactImageGrid
                onImageClick={handleImageClick}
                data={imageData} />
            );
React.render(imageGrid, document.getElementById('container'));