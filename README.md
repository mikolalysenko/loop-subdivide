loop-subdivide
==============
Applies an iteration of [Loop's algorithm](http://en.wikipedia.org/wiki/Loop_subdivision_surface) to a triangulated mesh.

# Example

```javascript
var bunny = require('bunny')
var loopSubdiv = require('loop-subdivide')

var smoothBunny = loopSubdiv(bunny.cells, bunny.positions)
```

# Usage

#### `var result = require('loop-subdivide')(cells, positions)`
Applies one iteration of Loop subdivision to the mesh

* `cells` are the cells of the mesh
* `positions` are the locations of the vertices of the mesh

**Returns** A new subdivide mesh

# License
(c) 2015 Mikola Lysenko. MIT License