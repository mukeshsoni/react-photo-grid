var _ = require('lodash');
var React = require('react');
var ReactImageGrid = require('../');

function handleImageClick(image) {
    console.log('Image clicked. Show it in a nice lightbox?');
}
console.log('1');
var imageData = [
        {
            id: Math.random()*1000,
            path: 'http://placehold.it/200x200'
        },
        {
            id: Math.random()*1000,
            path: 'http://placehold.it/600x700'
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

imageData = _.first(imageData, 4);

console.log('2');
var imageGrid = (
            <ReactImageGrid
                onImageClick={handleImageClick}
                data={imageData} />
            );
console.log('3');
React.render(imageGrid, document.getElementById('container'));

