//
// パズル固有スクリプト部 ましゅ版 mashu.js
//
(function (pidlist, classbase) {
    if (typeof module === "object" && module.exports) {
        module.exports = [pidlist, classbase];
    } else {
        pzpr.classmgr.makeCustom(pidlist, classbase);
    }
})(["hogemashu"], {
    //---------------------------------------------------------
    // マウス入力系
    MouseEvent: {
        inputModes: {
            edit: ["circle-shade", "circle-unshade", "circle-gray", "clear", "info-line"],
            play: ["line", "peke", "info-line"]
        },

        autoedit_func: "qnum",
        autoplay_func: "line",

        mouseinput_other: function () {
            switch (this.inputMode) {
                case "circle-gray":
                    this.inputFixedNumber(3);
                    break;
            }
        },

        mouseinput_clear: function () {
            this.inputFixedNumber(-1);
        },

        inputqnum_main: function (cell) {
            var order = [-1, 1, 3, 2];
            var current = order.indexOf(cell.qnum);
            var next;
            if (current === -1) {
                next = 1;
            } else if (this.btn === "left") {
                next = order[(current + 1) % order.length];
            } else {
                next = order[(current - 1 + order.length) % order.length];
            }
            this.inputFixedNumber(next);
        },
    },

    //---------------------------------------------------------
    // キーボード入力系
    KeyEvent: {
        enablemake: true
    },

    //---------------------------------------------------------
    // 盤面管理系
    Cell: {
        numberAsObject: true,

        maxnum: 3,

        setErrorPearl: function () {
            this.setCellLineError(1);
            var adc = this.adjacent,
                adb = this.adjborder;
            if (adb.top.isLine()) {
                adc.top.setCellLineError(0);
            }
            if (adb.bottom.isLine()) {
                adc.bottom.setCellLineError(0);
            }
            if (adb.left.isLine()) {
                adc.left.setCellLineError(0);
            }
            if (adb.right.isLine()) {
                adc.right.setCellLineError(0);
            }
        },

        //---------------------------------------------------------------------------
        // cell.setCellLineError()    セルと周りの線にエラーフラグを設定する
        //---------------------------------------------------------------------------
        setCellLineError: function (flag) {
            var bx = this.bx,
                by = this.by;
            if (flag) {
                this.seterr(1);
            }
            this.board.borderinside(bx - 1, by - 1, bx + 1, by + 1).seterr(1);
        }
    },

    Board: {
        hasborder: 1,

        // uramashu: false,
        //
        // revCircle: function() {
        // 	if (!this.uramashu) {
        // 		return;
        // 	}
        // 	this.revCircleMain();
        // },
        // revCircleConfig: function(newval) {
        // 	if (this.uramashu === newval) {
        // 		return;
        // 	}
        // 	this.uramashu = newval;
        // 	this.revCircleMain();
        // },
        // revCircleMain: function() {
        // 	for (var c = 0; c < this.cell.length; c++) {
        // 		var cell = this.cell[c];
        // 		if (cell.qnum === 1) {
        // 			cell.setQnum(2);
        // 		} else if (cell.qnum === 2) {
        // 			cell.setQnum(1);
        // 		}
        // 	}
        // }
    },

    LineGraph: {
        enabled: true
    },

    //---------------------------------------------------------
    // 画像表示系
    Graphic: {
        irowake: true,
        errcolor2: "rgb(192, 64, 64)",

        gridcolor_type: "LIGHT",

        circlefillcolor_func: "qnum2",
        circlestrokecolor_func: "qnum2",

        paint: function () {
            this.drawBGCells();
            this.drawDashedGrid();

            this.drawCircles();

            this.drawPekes();
            this.drawLines();

            this.drawChassis();

            this.drawTarget();
        },
        getCircleFillColor: function (cell) {
            if (cell.qnum === 1) {
                return cell.error === 1 ? this.errbcolor1 : "white";
            } else if (cell.qnum === 2) {
                return cell.error === 1 ? this.errcolor1 : this.quescolor;
            } else if (cell.qnum === 3) {
                return cell.error === 1 ? this.errcolor2 : "gray";
            }
            return null;
        },
        getCircleStrokeColor: function (cell) {
            if (cell.qnum === 1 || cell.qnum === 3) {
                return cell.error === 1 ? this.errcolor1 : this.quescolor;
            }
            return null;
        }
    },

    //---------------------------------------------------------
    // URLエンコード/デコード処理
    Encode: {
        decodePzpr: function (type) {
            this.decode4Cell();
        },
        encodePzpr: function (type) {
            this.encode4Cell();
        },
    },
    //---------------------------------------------------------
    FileIO: {
        decodeData: function () {
            this.decodeCellQnum();
            this.decodeBorderLine();
        },
        encodeData: function () {
            this.encodeCellQnum();
            this.encodeBorderLine();
        },
    },

    //---------------------------------------------------------
    // 正解判定処理実行部
    AnsCheck: {
        checklist: [
            "checkLineExist+",
            "checkBranchLine",
            "checkCrossLine",
            "checkWhitePearl1",
            "checkBlackPearl1",
            "checkGrayPearl1",
            "checkBlackPearl2",
            "checkWhitePearl2",
            "checkGrayPearl2",
            "checkNoLinePearl",
            "checkDeadendLine+",
            "checkNoLineIfVariant",
            "checkOneLoop"
        ],

        checkNoLinePearl: function () {
            this.checkAllCell(function (cell) {
                return cell.isNum() && cell.lcnt === 0;
            }, "mashuOnLine");
        },

        checkWhitePearl1: function () {
            var result = true,
                bd = this.board;
            for (var c = 0; c < bd.cell.length; c++) {
                var cell = bd.cell[c];
                if (!(cell.qnum === 1 && cell.isLineCurve())) {
                    continue;
                }

                result = false;
                if (this.checkOnly) {
                    break;
                }
                cell.setCellLineError(1);
            }
            if (!result) {
                this.failcode.add("mashuWCurve");
                bd.border.setnoerr();
            }
        },
        checkBlackPearl1: function () {
            var result = true,
                bd = this.board;
            for (var c = 0; c < bd.cell.length; c++) {
                var cell = bd.cell[c];
                if (!(cell.qnum === 2 && cell.isLineStraight())) {
                    continue;
                }

                result = false;
                if (this.checkOnly) {
                    break;
                }
                cell.setCellLineError(1);
            }
            if (!result) {
                this.failcode.add("mashuBStrig");
                bd.border.setnoerr();
            }
        },
        checkGrayPearl1: function () {
            var result = true,
                bd = this.board;
            for (var c = 0; c < bd.cell.length; c++) {
                var cell = bd.cell[c];
                if (!(cell.qnum === 3 && cell.isLineStraight())) {
                    continue;
                }

                result = false;
                if (this.checkOnly) {
                    break;
                }
                cell.setCellLineError(1);
            }
            if (!result) {
                this.failcode.add("hogemashuGStrig");
                bd.border.setnoerr();
            }
        },
        checkWhitePearl2: function () {
            var result = true,
                bd = this.board;
            for (var c = 0; c < bd.cell.length; c++) {
                var cell = bd.cell[c];
                if (cell.qnum !== 1 || cell.lcnt !== 2) {
                    continue;
                }
                var adc = cell.adjacent,
                    adb = cell.adjborder,
                    stcnt = 0;
                if (adb.top.isLine() && adc.top.isLineStraight()) {
                    stcnt++;
                }
                if (adb.bottom.isLine() && adc.bottom.isLineStraight()) {
                    stcnt++;
                }
                if (adb.left.isLine() && adc.left.isLineStraight()) {
                    stcnt++;
                }
                if (adb.right.isLine() && adc.right.isLineStraight()) {
                    stcnt++;
                }
                if (stcnt < 2) {
                    continue;
                }

                result = false;
                if (this.checkOnly) {
                    break;
                }
                cell.setErrorPearl();
            }
            if (!result) {
                this.failcode.add("mashuWStNbr");
                bd.border.setnoerr();
            }
        },
        checkBlackPearl2: function() {
            var result = true,
                bd = this.board;
            for (var c = 0; c < bd.cell.length; c++) {
                var cell = bd.cell[c],
                    adc = cell.adjacent,
                    adb = cell.adjborder;
                if (cell.qnum !== 2 || cell.lcnt !== 2) {
                    continue;
                }
                if (
                    !(adb.top.isLine() && adc.top.isLineCurve()) &&
                    !(adb.bottom.isLine() && adc.bottom.isLineCurve()) &&
                    !(adb.left.isLine() && adc.left.isLineCurve()) &&
                    !(adb.right.isLine() && adc.right.isLineCurve())
                ) {
                    continue;
                }

                result = false;
                if (this.checkOnly) {
                    break;
                }
                cell.setErrorPearl();
            }
            if (!result) {
                this.failcode.add("mashuBCvNbr");
                bd.border.setnoerr();
            }
        },
        checkGrayPearl2: function () {
            var result = true,
                bd = this.board;
            for (var c = 0; c < bd.cell.length; c++) {
                var cell = bd.cell[c],
                    adc = cell.adjacent,
                    adb = cell.adjborder;
                if (cell.qnum !== 3 || cell.lcnt !== 2) {
                    continue;
                }

                var short = [];
                short.push(adb.top.isLine() && adc.top.isLineCurve());
                short.push(adb.bottom.isLine() && adc.bottom.isLineCurve());
                short.push(adb.left.isLine() && adc.left.isLineCurve());
                short.push(adb.right.isLine() && adc.right.isLineCurve());
                var long = [];
                long.push(adb.top.isLine() && adc.top.isLineStraight());
                long.push(adb.bottom.isLine() && adc.bottom.isLineStraight());
                long.push(adb.left.isLine() && adc.left.isLineStraight());
                long.push(adb.right.isLine() && adc.right.isLineStraight());
                
                if (
                    short.filter(Boolean).length === 1 &&
                    long.filter(Boolean).length === 1
                ) {
                    continue;
                }

                result = false;
                if (this.checkOnly) {
                    break;
                }
                cell.setErrorPearl();
            }
            if (!result) {
                this.failcode.add("hogemashuGSet");
                bd.border.setnoerr();
            }
        },
    }
});
