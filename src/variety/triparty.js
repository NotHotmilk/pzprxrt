//
// パズル固有スクリプト部 三つ巴
//
/* global Set:false */
(function(pidlist, classbase) {
	if (typeof module === "object" && module.exports) {
		module.exports = [pidlist, classbase];
	} else {
		pzpr.classmgr.makeCustom(pidlist, classbase);
	}
})(["triparty"], {
	//---------------------------------------------------------
	// マウス入力系
	MouseEvent: {
		inputModes: {
			edit: ["mark-circle", "mark-triangle", "mark-rect", "clear"],
			play: ["mark-circle", "mark-triangle", "mark-rect", "objblank", "clear"]
		},
		mouseinput_other: function() {
			if (!this.mousestart) {
				return;
			}
			switch (this.inputMode) {
				case "mark-circle":
					this.inputFixedNumber(1);
					break;
				case "mark-triangle":
					this.inputFixedNumber(2);
					break;
				case "mark-rect":
					this.inputFixedNumber(3);
					break;
			}
		},
		mouseinput_auto: function() {
			if (this.puzzle.playmode) {
				if (this.btn === "left") {
					if (this.mousestart || this.mousemove) {
						this.dragDots();
					}
				} else if (this.btn === "right") {
					if (this.mousemove) {
						this.inputDot();
					}
				}
			}
			// else if (this.puzzle.editmode) {
			// 	if (this.mousestart || this.mousemove) {
			// 		this.inputborder();
			// 	}
			// }

			if (this.mouseend && this.notInputted()) {
				this.mouseCell = null;
				this.inputqnum();
			}
		},

		dragDots: function() {
			var cell = this.getcell();
			if (cell.isnull || cell === this.mouseCell) {
				return;
			}
			if (cell.qnum !== -1) {
				return;
			}
			if (this.mouseCell.isnull) {
				if (cell.anum !== -1) {
					return;
				}
				this.inputData = cell.qsub === 1 ? -2 : 10;
				this.mouseCell = cell;
				return;
			}

			if (this.inputData === -2) {
				cell.setAnum(-1);
				cell.setQsub(1);
			} else if (this.inputData === 10) {
				cell.setAnum(-1);
				cell.setQsub(0);
			}
			this.mouseCell = cell;
			cell.draw();
		},
		inputDot: function() {
			var cell = this.getcell();
			if (cell.isnull || cell === this.mouseCell || cell.qnum !== -1) {
				return;
			}

			if (this.inputData === null) {
				this.inputData = cell.qsub === 1 ? 0 : 1;
			}

			cell.setAnum(-1);
			cell.setQsub(this.inputData === 1 ? 1 : 0);
			this.mouseCell = cell;
			cell.draw();
		}
	},

	//---------------------------------------------------------
	// キーボード入力系
	KeyEvent: {
		enablemake: true,
		enableplay: true,

		keyinput: function(ca) {
			this.key_hakoiri(ca);
		},
		key_hakoiri: function(ca) {
			if (ca === "1" || ca === "q" || ca === "a" || ca === "z") {
				ca = "1";
			} else if (ca === "2" || ca === "w" || ca === "s" || ca === "x") {
				ca = "2";
			} else if (ca === "3" || ca === "e" || ca === "d" || ca === "c") {
				ca = "3";
			} else if (ca === "4" || ca === "r" || ca === "f" || ca === "v") {
				ca = " ";
			} else if (ca === "5" || ca === "t" || ca === "g" || ca === "b") {
				ca = " ";
			}
			this.key_inputqnum(ca);
		}
	},

	//---------------------------------------------------------
	// 盤面管理系
	Cell: {
		numberAsObject: true,
		enableSubNumberArray: true,
		maxnum: 3
	},
	Board: {
		hasborder: 1
	},

	// "AreaNumberGraph@hakoiri,tontonbeya": {
	// 	enabled: true
	// },

	AreaRoomGraph: {
		enabled: true
	},

	//---------------------------------------------------------
	// 画像表示系
	Graphic: {
		enablebcolor: true,

		paint: function() {
			this.drawBGCells();
			this.drawTargetSubNumber();
			this.drawGrid();
			//this.drawBorders();

			this.drawDotCells();
			this.drawQnumMarks();
			this.drawHatenas();
			this.drawSubNumbers();

			this.drawSolverQnumMarks();
			this.drawChassis();

			this.drawCursor();
		},

		getNumberTextCore: function(num) {
			if (num > 0) {
				return "○△◻"[num - 1];
			}
			return null;
		},

		drawQnumMarks: function() {
			var g = this.vinc("cell_mark", "auto");

			g.lineWidth = Math.max(this.cw / 18, 2);
			var rsize = this.cw * 0.3,
				tsize = this.cw * 0.26;
			var clist = this.range.cells;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i];

				g.vid = "c_mk_" + cell.id;
				g.strokeStyle =
					cell.qnum !== -1
						? this.getQuesNumberColor(cell)
						: this.getAnsNumberColor(cell);
				var px = cell.bx * this.bw,
					py = cell.by * this.bh;
				switch (cell.getNum()) {
					case 1:
						g.strokeCircle(px, py, rsize);
						break;
					case 2:
						g.beginPath();
						g.setOffsetLinePath(
							px,
							py,
							0,
							-tsize,
							-rsize,
							tsize,
							rsize,
							tsize,
							true
						);
						g.stroke();
						break;
					case 3:
						g.strokeRectCenter(px, py, rsize, rsize);
						break;
					default:
						g.vhide();
						break;
				}
			}
		},

		drawSolverQnumMarks: function() {
			var g = this.vinc("cell_mark_solver", "auto");

			g.lineWidth = Math.max(this.cw / 18, 2);
			var rsize = this.cw * 0.3,
				tsize = this.cw * 0.26;
			var clist = this.range.cells;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i];
				g.vid = "c_mk_solver_" + cell.id;
				g.strokeStyle = this.getSolverAnsNumberColor(cell);
				var px = cell.bx * this.bw,
					py = cell.by * this.bh;
				switch (cell.qansBySolver) {
					case 1:
						g.strokeCircle(px, py, rsize);
						break;
					case 2:
						g.beginPath();
						g.setOffsetLinePath(
							px,
							py,
							0,
							-tsize,
							-rsize,
							tsize,
							rsize,
							tsize,
							true
						);
						g.stroke();
						break;
					case 3:
						g.strokeRectCenter(px, py, rsize, rsize);
						break;
					default:
						g.vhide();
						break;
				}
			}
		}
	},

	//---------------------------------------------------------
	// URLエンコード/デコード処理
	Encode: {
		decodePzpr: function(type) {
			//this.decodeBorder();
			this.decodeNumber10();
		},
		encodePzpr: function(type) {
			//this.encodeBorder();
			this.encodeNumber10();
		}
	},
	//---------------------------------------------------------
	FileIO: {
		decodeData: function() {
			this.decodeAreaRoom();
			this.decodeCellQnum();
			this.decodeCellAnumsub();
		},
		encodeData: function() {
			this.encodeAreaRoom();
			this.encodeCellQnum();
			this.encodeCellAnumsub();
		}
	},

	//---------------------------------------------------------
	// 正解判定処理実行部
	AnsCheck: {
		checklist: [
			"checkAroundMarks@hakoiri",
			"checkThreeTypesInLine@alter",
			"checkOverFourMarksInBox",
			"checkDifferentNumberInRoom",
			"checkAlternatingLines@alter",
			"checkConnectNumber@hakoiri",
			"checkAllMarkInBox",
			"checkNoTypesInLine@alter"
		],

		checkOverFourMarksInBox: function() {
			this.checkAllBlock(
				this.board.roommgr,
				function(cell) {
					return cell.isNum();
				},
				function(w, h, a, n) {
					return a <= 3;
				},
				"bkNumGt3"
			);
		},
		checkAllMarkInBox: function() {
			this.checkAllBlock(
				this.board.roommgr,
				function(cell) {
					return cell.isNum();
				},
				function(w, h, a, n) {
					return a >= 3;
				},
				"bkNumLt3"
			);
		},

		checkAroundMarks: function() {
			this.checkAroundCell(function(cell1, cell2) {
				return cell1.getNum() >= 0 && cell1.getNum() === cell2.getNum();
			}, "nmAround");
		},

		checkAlternatingLines: function() {
			var bd = this.board;
			var hasError = false;
			this.checkRowsCols(function(clist) {
				var found = null;

				for (var idx = 0; idx < clist.length; idx++) {
					var cell = clist[idx];
					if (!cell.isNum()) {
						continue;
					}

					if (found && found.getNum() === cell.getNum()) {
						if (this.checkOnly) {
							return false;
						}
						hasError = true;
						bd.cellinside(found.bx, found.by, cell.bx, cell.by).seterr(1);
					}
					found = cell;
				}

				return true;
			}, "nmDupRow");

			if (hasError) {
				this.failcode.add("nmDupRow");
			}
		},

		checkThreeTypesInLine: function() {
			this.checkRowsCols(function(clist) {
				var found = [false, false, false];

				clist.each(function(cell) {
					var num = cell.getNum();
					if (num >= 1 && num <= 3) {
						found[num - 1] = true;
					}
				});

				if (found[0] && found[1] && found[2]) {
					clist.seterr(1);
					return false;
				}
				return true;
			}, "nmTripRow");
		},

		checkNoTypesInLine: function() {
			this.checkRowsCols(function(clist) {
				var found = clist.filter(function(cell) {
					return cell.isNum();
				});

				if (found.length < 2) {
					clist.seterr(1);
					return false;
				}
				return true;
			}, "nmMissRow");
		}
	},

});
