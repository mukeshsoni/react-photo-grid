var React = require('react');
var ReactImageGrid = require('../');

function handleImageClick(image) {
    console.log('Image clicked. Show it in a nice lightbox?');
}
console.log('1');
var imageData = [
        {
            id: Math.random()*1000,
            path: 'http://placehold.it/1000/1000'
        },
        {
            id: Math.random()*1000,
            path: 'http://placehold.it/400/500'
        },
        {
            id: Math.random()*1000,
            path: 'http://placehold.it/500/300'
        },
        {
            id: Math.random()*1000,
            path: 'http://placehold.it/600/800'
        }
    ];

console.log('2');
var imageGrid = (
            <ReactImageGrid
                onImageClick={handleImageClick}
                data={imageData} />
            );
console.log('3');
React.render(imageGrid, document.getElementById('container'));

