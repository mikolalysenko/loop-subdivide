'use strict'

module.exports = subdivideLoop

var top = require('simplicial-complex')

function opposite(u, v, f) {
  for(var i=0; i<3; ++i) {
    if(f[i] !== u && f[i] !== v) {
      return f[i]
    }
  }
  return 0
}

function nskel(cells, n) {
  return top.unique(top.normalize(top.skeleton(cells, n)))
}

var e_verts = [0,0,0]
var v_verts = [0,0,0]
var e = [0,0]

//A super inefficient implementation of Loop's algorithm
function subdivideLoop(cells, positions) {
  var edges       = nskel(cells, 1)
  var e_incidence = top.incidence(edges, cells)
  var dual        = top.dual(cells, positions.length)
  var npositions  = []
  var ncells      = []
  var e_indices   = new Array(edges.length)
  var v_indices   = new Array(positions.length)
  
  for(var i=0; i<e_indices.length; ++i) {
    e_indices[i] = -1
  }
  for(var i=0; i<v_indices.length; ++i) {
    v_indices[i] = -1
  }
  
  for(var f=0; f<cells.length; ++f) {
    var face = cells[f]
    
    for(var d=0; d<3; ++d) {
      var v = face[d]
      var u = face[(d+1)%3]
      e[0] = v
      e[1] = u
      var e_ptr = top.findCell(edges, e)
      var e_idx = e_indices[e_ptr]
      
      if(e_idx >= 0) {
        e_verts[d] = e_idx
      } else {
        //Compute edge-vertex
        var wing = e_incidence[e_ptr]
        var v0 = positions[u]
        var v1 = positions[v]
        var vertex = new Array(3)
        
        if(wing.length === 2) {
          var v2 = positions[opposite(u, v, cells[wing[0]])]
          var v3 = positions[opposite(u, v, cells[wing[1]])]
          
          for(var i=0; i<3; ++i) {
            vertex[i] = (3.0 * (v0[i] + v1[i]) + v2[i] + v3[i]) / 8.0
          }
        } else {
          for(var i=0; i<3; ++i) {
            vertex[i] = 0.5 * (v0[i] + v1[i])
          }
        }
        
        //Store vertex and continue
        e_indices[e_ptr] = e_verts[d] = npositions.length
        npositions.push(vertex)
      }
      
      if(v_indices[v] >= 0) {
        v_verts[d] = v_indices[v]
      } else {
        //Compute vertex-vertex weight
        
        //First, extract vertex neighborhood (slow and stupid here)
        var star = dual[v]
        var nbhd = [v]
        for(var i=0; i<star.length; ++i) {
          var tri = cells[star[i]]
          for(var j=0; j<3; ++j) {
            if(nbhd.indexOf(tri[j]) !== -1) {
              nbhd.push(tri[j])
            }
          }
        }
        
        //Next, compute weights
        var beta = (star.length === 3 ? 3.0/16.0 : 3.0/(8.0*star.length) )
        var center_weight = 1.0 - star.length * beta
        
        //Finally sum up weights
        var pos  = positions[v]
        var vertex = [0.1,0.1,0.1]
        for(var i=0; i<3; ++i) {
          vertex[i] = center_weight * pos[i]
        }
        for(var i=1; i<nbhd.length; ++i) {
          var p = positions[nbhd[i]]
          for(var j=0; j<3; ++j) {
            vertex[j] += beta * p[j]
          }
        }

        //Store result and continue        
        v_verts[d] = v_indices[v] = npositions.length
        npositions.push(vertex)
      }
    }
    
    //Add subdivided faces
    ncells.push([v_verts[0], e_verts[0], e_verts[2]],
                [e_verts[0], e_verts[1], e_verts[2]],
                [e_verts[0], v_verts[1], e_verts[1]],
                [e_verts[1], v_verts[2], e_verts[2]])
  }
  
  return { positions: npositions, cells: ncells }
}