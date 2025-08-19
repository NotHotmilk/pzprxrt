(function (pidlist, classbase) {
    if (typeof module === "object" && module.exports) {
        module.exports = [pidlist, classbase];
    } else {
        pzpr.classmgr.makeCustom(pidlist, classbase);
    }
})(["the_longest"], {
    //---------------------------------------------------------
    // マウス入力系
    MouseEvent: {
        use: true,

        inputModes: {
            edit: ["border"],
            play: ["border", "subline"]
        },
        autoedit_func: "areanum",
        autoplay_func: "border",
    },

    //---------------------------------------------------------
    // キーボード入力系
    KeyEvent: {
        enablemake: true,
    },

    //---------------------------------------------------------
    // 盤面管理系

    Border: {
        enableLineNG: true
    },
    Board: {
        cols: 6,
        rows: 6,
        hasborder: 2,
        borderAsLine: true,

    },
    AreaRoomGraph: {
        enabled: true
    },
    LineGraph: {
        enabled: true
    },

    //---------------------------------------------------------
    // 画像表示系
    Graphic: {
        gridcolor_type: "DLIGHT",

        bordercolor_func: "qans",

        paint: function () {
            this.drawBGCells();
            this.drawDashedGrid(false);

            this.drawBorders();
            this.drawBorderQsubs();
        },

        getBorderColor: function (border) {
            if (!!border.ques) {
                return border.error === 1 ? this.errcolor1 : "black";
            }

            return this.getBorderColor_qans(border);
        }
    },


    //---------------------------------------------------------
    // URLエンコード/デコード処理
    Encode: {
        decodePzpr: function (type) {
            this.decodeTheLongest();
            this.puzzle.setConfig("the_shortest", this.checkpflag("s"));
        },
        encodePzpr: function (type) {
            this.encodeTheLongest();
            this.outpflag = this.puzzle.getConfig("the_shortest") ? "s" : null;
        },

        encodeTheLongest: function () {
            var cm = "",
                twi = [16, 8, 4, 2, 1],
                num = 0,
                pass = 0;
            var bd = this.board;

            for (var id = 0; id < bd.border.length; id++) {
                // 境界線が壁 (ques===1) かどうかを判定
                if (bd.border[id].ques === 1) {
                    pass += twi[num];
                }
                num++;
                if (num === 5) {
                    cm += pass.toString(32);
                    num = 0;
                    pass = 0;
                }
            }
            if (num > 0) {
                cm += pass.toString(32);
            }
            this.outbstr += cm;
        },

        decodeTheLongest: function () {
            var bstr = this.outbstr,
                bd = this.board,
                twi = [16, 8, 4, 2, 1];
            var pos = 0, id = 0;

            while (pos < bstr.length && id < bd.border.length) {
                var ca = parseInt(bstr.charAt(pos), 32);
                for (var w = 0; w < 5; w++) {
                    if (id < bd.border.length) {
                        var border = bd.border[id];
                        border.ques = (ca & twi[w]) ? 1 : 0;
                        id++;
                    }
                }
                pos++;
            }

            this.outbstr = bstr.substr(pos);
        }
    },
    //---------------------------------------------------------
    FileIO: {
        decodeData: function () {
        },
        encodeData: function () {
        }
    },

    //---------------------------------------------------------
    // 正解判定処理実行部
    AnsCheck: {}
});
