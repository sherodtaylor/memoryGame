/**
 * @providesModule memoryGame
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  Animation,
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var GameBoard = require('GameBoard');
var TouchableHighlight = require('TouchableHighlight');

var BOARD_PADDING = 3;
var CELL_MARGIN = 4;
var CELL_SIZE = 60;

class Board extends React.Component {
  render() {
    return (
      <View style={styles.board}>
        {this.props.children}
      </View>
    );
  }
}

class Row extends React.Component {
  render() {
    var board = this.props.board;
    var row = this.props.row;

    return (
      <View style={styles.row}>
        {row.map((tile) => <Tile board={board} ref={tile.id} key={tile.id} tile={tile} />) }
      </View>
    );
  }
}

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tile: props.tile
    };
    this.state.tile.componentRef = this;
  }

  rerenderTile(tile) {
    this.setState({
      tile: tile
    });
    this.state.tile.rerenderTile = this.rerenderTile.bind(this);
  }

  onTouch() {
    var board = this.props.board;
    var tile = this.props.tile;

    tile.flip.call(this, board, tile);
    this.setState({
      tile: tile
    });

    if (board.hasWon()) {
      board.openOverlay();
    }
  }

  renderFlipped() {
    var tile = this.state.tile;

    var tileStyles = [
      styles.tile,
      styles['flipped' + tile.value]
    ];

    var textStyles = [
      styles.whiteText,
      styles.value
    ];

    return (
      <TouchableHighlight onPress={this.onTouch.bind(this)}
      activeOpacity={0.6}>
        <View style={tileStyles}>
          <Text style={textStyles}>{tile.value}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderInitial() {
    var tile = this.state.tile;

    var tileStyles = [
      styles.tile
    ];

    var textStyles = [
      styles.whiteText,
      styles.hidden,
      styles.value
    ];

    console.log('I should be unflipped')
    return (
      <TouchableHighlight onPress={this.onTouch.bind(this)}
      activeOpacity={0.6}>
        <View style={tileStyles}>
          <Text style={textStyles}>{tile.value}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    var tile = this.props.tile;
    console.log(tile)
    if (tile.matched || tile.flipped) {
      return this.renderFlipped();
    }
    return this.renderInitial();
  }
}

class GameEndOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: props.board
    };
    this.state.board = this.openOverlay.bind(this);
  }

  openOverlay() {
    this.setState({
      board: this.state.board
    })
  }

  render() {
    var board = this.props.board;

    if (!board.hasWon()) {
      return <View/>;
    }

    var message = board.hasWon() ? 'Good Job!' : 'Game Over';

    return (
      <View style={styles.overlay}>
        <Text style={styles.overlayMessage}>{message}</Text>
        <TouchableBounce onPress={this.props.onRestart}>
          <View style={styles.tryAgain}>
            <Text style={styles.tryAgainText}>Try Again?</Text>
          </View>
        </TouchableBounce>
      </View>
    );
  }
}

class memoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: new GameBoard(),
    };
  }

  restartGame() {
    this.setState({board: new GameBoard()});
  }

  render() {
    var board = this.state.board;
    var rows = this.state.board.cells.map((cell) => {
      return (
        <Row board={board} row={cell} />
      );
    });

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Memory Game</Text>
        <View>
          <Board>
            {rows}
          </Board>
          <GameEndOverlay board={this.state.board} onRestart={() => this.restartGame()} />
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    padding: BOARD_PADDING,
    backgroundColor: '#bbaaaa',
    borderRadius: 5,
  },
  header: {
    textAlign: 'center',
    color: '#000',
    backgroundColor: '#fff',
    marginBottom: 20
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(221, 221, 221, 0.5)',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayMessage: {
    fontSize: 40,
    marginBottom: 20,
  },
  tryAgain: {
    backgroundColor: '#887766',
    padding: 20,
    borderRadius: 5,
  },
  tryAgainText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 5,
    margin: CELL_MARGIN,
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: CELL_SIZE, 
    height: CELL_SIZE,
    backgroundColor: '#ddccbb',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#afafaf',
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    color: '#776666',
    fontFamily: 'Verdana',
    fontWeight: '500',
  },
  flipped1: {
    backgroundColor: '#f2f2f2',
  },
  flipped2: {
    backgroundColor: '#ffbb88',
  },
  flipped3: {
    backgroundColor: '#ff9966',
  },
  flipped4: {
    backgroundColor: '#ff7755',
  },
  flipped5: {
    backgroundColor: '#ff5533',
  },
  flipped6: {
    backgroundColor: '#eecc77',
  },
  flipped7: {
    backgroundColor: '#eecc66',
  },
  flipped8: {
    backgroundColor: '#eecc55',
  },
  flipped9: {
    backgroundColor: '#eecc33',
  },
  flipped10: {
    backgroundColor: '#eecc22',
  },
  whiteText: {
    color: '#ffffff',
  },
  hidden: {
    opacity: 0
  }
});

AppRegistry.registerComponent('memoryGame', () => memoryGame);

module.exports = memoryGame;
