import React, { Component } from "react";
import { render } from "react-dom";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import prism from "react-syntax-highlighter/dist/esm/styles/prism/prism";

import ReactPhotoGrid from "../../src/ReactPhotoGrid";

SyntaxHighlighter.registerLanguage("jsx", jsx);

class Demo extends Component {
  handleImageClick = (image) => {
    console.log("Image clicked", image);
  };

  render() {
    var imageData = [
      "http://via.placeholder.com/400x400/",
      "http://via.placeholder.com/500x700/",
      "http://via.placeholder.com/600x500/",
      "http://via.placeholder.com/600x800/",
    ];

    return (
      <div style={{ maxWidth: 1000, margin: "auto" }}>
        <h4>
          Github repo -{" "}
          <a href="https://github.com/mukeshsoni/react-photo-grid">
            https://github.com/mukeshsoni/react-photo-grid
          </a>
        </h4>
        <h1>React Photo Grid</h1>
        <h4>
          Grid dimensions auto calculated based on available space in container
          component
        </h4>
        <SyntaxHighlighter language="javascript" style={prism}>
          {`var imageData = [
  "http://via.placeholder.com/400x400/",
  "http://via.placeholder.com/500x700/",
  "http://via.placeholder.com/600x500/",
  "http://via.placeholder.com/600x800/",
];
`}
        </SyntaxHighlighter>
        <SyntaxHighlighter style={prism} language="javascript">
          {`<ReactPhotoGrid
  onImageClick={this.handleImageClick}
  data={imageData}
/>
`}
        </SyntaxHighlighter>
        <ReactPhotoGrid onImageClick={this.handleImageClick} data={imageData} />
        <h4>Specify a grid size to container the grid to some dimensions</h4>
        <p>Here&apos;s a grid if size 400px width and 400px height</p>
        <SyntaxHighlighter style={prism} language="javascript">
          {`<ReactPhotoGrid
  onImageClick={this.handleImageClick}
  data={imageData}
  gridSize="400x400"
/>
`}
        </SyntaxHighlighter>
        <ReactPhotoGrid
          onImageClick={this.handleImageClick}
          data={imageData}
          gridSize="400x400"
        />
        <h4>
          Contain the grid dimensions by specify a width to container element
        </h4>
        <p>Here we specify a width of 500px to parent</p>
        <SyntaxHighlighter style={prism} language="javascript">
          {`<div style={{width: 500}}>
  <ReactPhotoGrid
    onImageClick={this.handleImageClick}
    data={imageData}
  />
</div>
`}
        </SyntaxHighlighter>
        <div style={{ width: 500 }}>
          <ReactPhotoGrid
            onImageClick={this.handleImageClick}
            data={imageData}
          />
        </div>
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
