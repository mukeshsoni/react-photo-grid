var _ = require('lodash');
var React = require('react');
var ReactImageGrid = require('../');

function handleImageClick(image) {
    console.log('Image clicked. Show it in a nice lightbox?');
}

var feelingLucky = Math.floor(Math.random()*2);
var luckType = ['', 'nightlife', 'animals', 'city', 'people', 'nature', 'sports', 'cats', 'abstract', 'transport'];
var imageData;

if(feelingLucky) {
    var luckTypeSelector = luckType[Math.floor(Math.random()*luckType.length)];
    imageData = [
        {
            id: Math.random()*1000,
            path: 'http://lorempixel.com/300/300/'+luckTypeSelector
        },
        {
            id: Math.random()*1000,
            path: 'http://lorempixel.com/500/700/'+luckTypeSelector
        },
        {
            id: Math.random()*1000,
            path: 'http://lorempixel.com/500/300/'+luckTypeSelector
        },
        {
            id: Math.random()*1000,
            path: 'http://lorempixel.com/600/800/'+luckTypeSelector
        }
    ];
} else {
    imageData = [
        {
            id: Math.random()*1000,
            path: 'http://placehold.it/300x300'
        },
        {
            id: Math.random()*1000,
            path: 'http://placehold.it/500x700'
        },
        {
            id: Math.random()*1000,
            path: 'http://placehold.it/500x300'
        },
        {
            id: Math.random()*1000,
            path: 'http://placehold.it/600x800'
        }
    ];
}

imageData = _.first(imageData, 4);

var imageGrid = (
            <ReactImageGrid

                onImageClick={handleImageClick}
                data={imageData} />
            );
React.render(imageGrid, document.getElementById('container'));