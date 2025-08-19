//
// パズル固有スクリプト部 数コロ・ヴィウ・数コロ部屋版 sukoro.js
//
(function (pidlist, classbase) {
    if (typeof module === "object" && module.exports) {
        module.exports = [pidlist, classbase];
    } else {
        pzpr.classmgr.makeCustom(pidlist, classbase);
    }
})(["soulmates"], {
    //---------------------------------------------------------
    // マウス入力系
    MouseEvent: {
        inputModes: {
            edit: ["number", "clear"],
            play: ["number", "numexist", "numblank", "clear"]
        },
        autoedit_func: "qnum",
        autoplay_func: "qnum"
    },

    //---------------------------------------------------------
    // キーボード入力系
    KeyEvent: {
        enablemake: true,
        enableplay: true,

        keyinput: function (ca) {
            this.key_sukoro(ca);
        },
        key_sukoro: function (ca) {
            if (this.puzzle.playmode) {
                var cell = this.cursor.getc();
                if (ca === "q" || ca === "a" || ca === "z") {
                    ca = cell.qsub === 1 ? "1" : "s1";
                } else if (ca === "w" || ca === "s" || ca === "x") {
                    ca = cell.qsub === 2 ? "2" : "s2";
                } else if (ca === "e" || ca === "d" || ca === "c" || ca === "-") {
                    ca = " ";
                } else if (ca === "1" && cell.anum === 1) {
                    ca = "s1";
                } else if (ca === "2" && cell.anum === 2) {
                    ca = "s2";
                }
            }
            this.key_inputqnum(ca);
        }
    },

    //---------------------------------------------------------
    // 盤面管理系
    Cell: {
        numberWithMB: true,
    
        maxnum: function () {
            return this.board.cols * this.board.rows;
        },
        
        // 正答判定用
        getViewClist: function () {
            var sx = this.bx,
                sy = this.by,
                clist = new this.klass.CellList();
            for (var dir = 1; dir <= 4; dir++) {
                var pos = new this.klass.Address(sx, sy);
                while (1) {
                    pos.movedir(dir, 2);
                    var cell = pos.getc();
                    if (!cell.isnull && cell.noNum() && cell.qsub !== 1) {
                        clist.add(cell);
                    } else {
                        break;
                    }
                }
            }
            return clist;
        }
    },

    Board: {
        cols: 5,
        rows: 5
    },

    AreaNumberGraph: {
        enabled: true
    },

    //---------------------------------------------------------
    // 画像表示系
    Graphic: {
        paint: function () {
            this.drawBGCells();
            this.drawGrid();

            this.drawMBs();
            this.drawAnsNumbers();
            this.drawQuesNumbers();
            
            this.drawDotCells();

            this.drawSolverAnsNumbers();

            this.drawChassis();

            this.drawCursor();
        },

        drawDotCells: function() {
            var g = this.vinc("cell_dot", "auto", true);

            var dsize = Math.max(this.cw * 0.06, 2);
            var clist = this.range.cells;
            for (var i = 0; i < clist.length; i++) {
                var cell = clist[i];

                g.vid = "c_dot_" + cell.id;
                if (cell.qsub === 2|| cell.isDotBySolver()) {
                    if (!cell.trial) {
                        g.fillStyle = this.getColorSolverAware(cell.qsub === 2, cell.qsubBySolver === 1);
                    } else {
                        g.fillStyle = this.trialcolor;
                    }
                    g.fillCircle(cell.bx * this.bw, cell.by * this.bh, dsize);
                } else {
                    g.vhide();
                }
            }
        },

        drawMBs: function() {
            var g = this.vinc("cell_mb", "auto", true);
            g.lineWidth = 1;

            var rsize = this.cw * 0.35;
            var clist = this.range.cells;
            for (var i = 0; i < clist.length; i++) {
                var cell = clist[i],
                    px,
                    py;
                if (cell.qsub > 0) {
                    px = cell.bx * this.bw;
                    py = cell.by * this.bh;
                    g.strokeStyle = !cell.trial ? this.mbcolor : "rgb(192, 192, 192)";
                }

                g.vid = "c_MB1_" + cell.id;
                if (cell.qsub === 1) {
                    g.strokeCircle(px, py, rsize);
                } else {
                    g.vhide();
                }

                // g.vid = "c_MB2_" + cell.id;
                // if (cell.qsub === 2) {
                //     g.strokeCross(px, py, rsize);
                // } else {
                //     g.vhide();
                // }
            }
        },
    },

    //---------------------------------------------------------
    // URLエンコード/デコード処理
    Encode: {
        decodePzpr: function (type) {
            this.decodeNumber16();
        },
        encodePzpr: function (type) {
            this.encodeNumber16();
        }
    },
    //---------------------------------------------------------
    FileIO: {
        decodeData: function () {
            this.decodeCellQnum();
            this.decodeCellAnumsub();
        },
        encodeData: function () {
            this.encodeCellQnum();
            this.encodeCellAnumsub();
        }
    },
    //---------------------------------------------------------
    // 正解判定処理実行部
    AnsCheck: {
        checklist: [

        ],
    }
});