import React, { Component } from 'react'
import { render } from 'react-dom'

import ReactImageGrid from '../../src/index.js'

class Demo extends Component {
    handleImageClick = (image) => {
        console.log('Image clicked', image)
    }

    render() {
        var imageData = [
            'http://via.placeholder.com/400x400/',
            'http://via.placeholder.com/500x700/',
            'http://via.placeholder.com/600x500/',
            'http://via.placeholder.com/600x800/'
        ];

        return <div>
            <h1>React Photo Grid</h1>
            <ReactImageGrid
                onImageClick={this.handleImageClick}
                data={imageData} />
        </div>
    }
}

render(<Demo />, document.querySelector('#demo'))
