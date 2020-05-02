Reactjs Component for Facebook like photo/image grids
=====================================================

This component shows images in a neat square (or whatever dimensions you want) grid. Acts like facebooks image grids. Switches between two modes randomly (small images on right or bottom).

The component tries to figure out the best image to show as the main image (based on their dimensions).

<a href='https://cdn.rawgit.com/mukeshsoni/react-photo-grid/master/example/index.html' target='_blank'>Live Demo</a>

![How it looks](https://farm8.staticflickr.com/7484/15736005117_57154548cc.jpg "How it looks")

#Usage
```JavaScript
var imageData = [
    'http://via.placeholder.com/400x400/',
    'http://via.placeholder.com/500x700/',
    'http://via.placeholder.com/600x500/',
    'http://via.placeholder.com/600x800/'
];

// whereever you use ReactPhotoGrid
<ReactPhotoGrid
    onImageClick={this.handleImageClick}
    data={imageData} 
/>
);
```

The dimensions of the final grid depends on the images provided and the amount
of space in the parent container. If the widest image is selected as the hero
image and the width of container element is more that that width, the grid width
will be that images width. 

To contain the grid width, you can do one of 3 things - 

1. Specify a gridSize. The grid size is specified as `wxh`, width and height
   numbers separated by an `x`. E.g. `500x500`;

```JavaScript
<ReactPhotoGrid
  onImageClick={this.handleImageClick}
  data={imageData}
  gridSize="400x400"
/>
```

2. Set a width on the container of ReactPhotoGrid like below - 


```JavaScript
<div style={{width: 500}}>
  <ReactPhotoGrid
      onImageClick={this.handleImageClick}
      data={imageData}
  />
</div>
```

3. Specify a containerWidth

```JavaScript
<ReactPhotoGrid
    onImageClick={this.handleImageClick}
    data={imageData}
    containerWidth={500}
/>
```

You can also pass gridSize as a property. It's a string which consists of width and height separated by an x. E.g. gridSize="500x500".

If you don't pass any gridSize, the grid size is chosen based on the parent's width.
