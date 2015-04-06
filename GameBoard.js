/**
 * @providesModule GameBoard
 * @flow
 */
'use strict';

var Tile = function (value?: number) {
  this.value = value || 0;
  this.matched = false;
  this.flipped = false;
  this.id = Tile.id++;
};

Tile.id = 0;

Tile.prototype.isMatch = function (lastTile?: Object) {
  if (!lastTile) {
    return false;
  }
  return (this.id !== lastTile.id) && (lastTile.value === this.value) ? true : false;
};

Tile.prototype.match = function() {
  this.matched = true;
};

Tile.prototype.flip = function(board?: Object) {
  if (this.matched) {
    return true;
  }

  if (this.isMatch(board.lastTile)) {
    board.lastTile.match();

    this.match(); 
    return true;
  }

  this.flipped = true;
  this.resetTile(board);

  if (!board.lastTile || !board.lastTile.id) {
    return board.setLastTile(this);
  }

  board.lastTile.flipped = true;
  board.setLastTile(this);

  return this.flipped;
};

Tile.prototype.resetTile = function(board?: Object) {
  var tile = this;
  return setTimeout(function() {
    if (tile.matched) {
      return;
    }

    tile.flipped = false;

    tile.componentRef.setState({
      tile: tile
    });

    board.setLastTile({});
  }, 1000);
};

var Board = function (level?: number) {
  var randomTiles = [];
  this.tiles = [];
  this.cells = [];

  this.level = level || Board.level++;
  this.size = this.level * 2;

  // Generating the Pair of tiles
  for (var i = 1; i <= ((this.size * this.size) / 2); ++i) {
    for (var ii = 0; ii < 2; ++ii) {
      var tile = this.addTile(i);
      randomTiles.push(tile);
    }
  }

  // randomizing the array of tiles
  randomTiles = shuffle(randomTiles);

  // then adding them to each row
  for (i = 0; i < this.size; ++i) {
    this.cells[i] = [];
    var row = this.cells[i];

    for (ii = 0; ii < this.size; ++ii) {
      var randTile = randomTiles.pop();
      row.push(randTile);
    }
  }
};

Board.level = 1;

Board.prototype.addTile = function () {
  var res = new Tile();
  Tile.apply(res, arguments);
  this.tiles.push(res);
  return res;
};

Board.prototype.setLastTile = function(lastTile?: Object) {
  this.lastTile = lastTile;
  return lastTile;
};

Board.prototype.hasWon = function() {
  var allMatched = true;
  for (var i = 0; i < this.cells.length; i++) {
    var row = this.cells[i];
    console.log(row)
    for (var ii = 0; ii < row.length; ii++) {
      if (!row[ii].matched) {
        allMatched = false;
      }
    }
  }

  return allMatched;
};

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

module.exports = Board;
