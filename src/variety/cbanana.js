(function(pidlist, classbase) {
	if (typeof module === "object" && module.exports) {
		module.exports = [pidlist, classbase];
	} else {
		pzpr.classmgr.makeCustom(pidlist, classbase);
	}
})(["cbanana"], {
	MouseEvent: {
		use: true,
		inputModes: {
			edit: ["number", "clear"],
			play: ["shade", "unshade"]
		},
		autoedit_func: "qnum",
		autoplay_func: "cell"
	},

	KeyEvent: {
		enablemake: true
	},

	Cell: {
		maxnum: function() {
			return this.board.cols * this.board.rows;
		}
	},

	AreaShadeGraph: {
		enabled: true
	},
	AreaUnshadeGraph: {
		enabled: true
	},

	Graphic: {
		gridcolor_type: "DARK",

		enablebcolor: true,

		drawDotCells: function() {
			var g = this.vinc("cell_dot", "auto", true);

			var dsize = Math.max(this.cw * 0.12, 2);
			var clist = this.range.cells;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i];

				g.vid = "c_dot_" + cell.id;
				if (cell.isDot()|| cell.isDotBySolver()) {
					if (!cell.trial) {
						g.fillStyle = this.getColorSolverAware(cell.qsub === 1, cell.qsubBySolver === 1);
					} else {
						g.fillStyle = this.trialcolor;
					}
					g.fillCircle(cell.bx * this.bw, cell.by * this.bh, dsize);
				} else {
					g.vhide();
				}
			}
		},

		paint: function() {
			this.drawBGCells();
			this.drawShadedCells();
			this.drawGrid();
			this.drawDotCells();

			this.drawQuesNumbers();

			this.drawChassis();

			this.drawTarget();
		}
	},

	Encode: {
		decodePzpr: function(type) {
			this.decodeNumber16();
		},
		encodePzpr: function(type) {
			this.encodeNumber16();
		}
	},
	FileIO: {
		decodeData: function() {
			this.decodeCellQnum();
			this.decodeCellAns();
		},
		encodeData: function() {
			this.encodeCellQnum();
			this.encodeCellAns();
		}
	},

	AnsCheck: {
		checklist: [
			"checkShadeRect",
			"checkUnshadeNotRect",
			"checkNumberSize",
			"doneShadingDecided"
		],

		checkNumberSize: function() {
			for (var i = 0; i < this.board.cell.length; i++) {
				var cell = this.board.cell[i];
				var qnum = cell.qnum;
				if (qnum <= 0) {
					continue;
				}

				var block = cell.isShade() ? cell.sblk : cell.ublk;
				var d = block.clist.length;

				if (d !== qnum) {
					this.failcode.add("bkSizeNe");
					if (this.checkOnly) {
						return;
					}
					block.clist.seterr(1);
				}
			}
		},

		checkShadeRect: function() {
			this.checkAllArea(
				this.board.sblkmgr,
				function(w, h, a, n) {
					return w * h === a;
				},
				"csNotRect"
			);
		},

		checkUnshadeNotRect: function() {
			this.checkAllArea(
				this.board.ublkmgr,
				function(w, h, a, n) {
					return w * h !== a;
				},
				"cuRect"
			);
		}
	}
});
