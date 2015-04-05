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
  return this.id !== lastTile.id && lastTile.value === this.value ? true : false;
};

Tile.prototype.match = function() {
  this.matched = true;
};

Tile.prototype.flip = function (board?: Object) {
  if (this.isMatch(board.lastTile)) {
    board.lastTile.match();
    this.match(); 
    board.setLastTile(null);
    return true;
  }

  board.setLastTile(this);
  this.flipped = true;
  board.lastTile.flipped = true;
  return this.flipped;
};

var Board = function () {
  this.tiles = [];
  this.cells = [];
  var randomTiles = [];

  // Generating the Pair of tiles
  for (var i = 1; i <= (Board.size * 2); ++i) {
    for (var ii = 0; ii < 2; ++ii) {
      var tile = this.addTile(i);
      randomTiles.push(tile);
    }
  }

  // randomizing the array of tiles
  randomTiles = shuffle(randomTiles);

  // then adding them to each row
  for (i = 0; i < Board.size; ++i) {
    this.cells[i] = [];
    var row = this.cells[i];

    for (ii = 0; ii < Board.size; ++ii) {
      var randTile = randomTiles.pop();
      row.push(randTile);
    }
  }

  this.won = false;
};

Board.prototype.addTile = function () {
  var res = new Tile();
  Tile.apply(res, arguments);
  this.tiles.push(res);
  return res;
};

Board.prototype.resetFlippedTiles = function() {
  for (var i = 0; i < this.cells.length; i++) {
    var row = this.cells[i];
    for (var ii = 0; ii < row.length; ii++) {
      var tile = row[i]
      tile.flipped = false;
      tile.rerenderTile(tile);
    }
  }
};

Board.size = 4;

Board.prototype.setLastTile = function(lastTile?: Object) {
  this.lastTile = lastTile;
  return lastTile;
};

Board.prototype.hasWon = function () {
  return this.won;
};

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

module.exports = Board;
