'use strict'

var createScene = require('gl-scene3d')
var createMesh = require('gl-simplicial-complex')
var bunny = require('bunny')
var fit = require('canvas-fit')
var loop = require('../loop')

var canvas = document.createElement('canvas')
document.body.appendChild(canvas)
window.addEventListener('resize', fit(canvas))

//Subdivide
bunny = loop(bunny.cells, bunny.positions)

var scene = createScene(canvas)
var mesh = createMesh(scene.gl, {
  cells:      bunny.cells,
  positions:  bunny.positions,
  colormap:   'jet'
})

scene.addObject(mesh)