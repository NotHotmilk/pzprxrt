// GraphicCommon.js v3.4.1

pzpr.classmgr.makeCommon({
	//---------------------------------------------------------
	Graphic: {
		paintPost: function() {
			this.drawTrialStarts();
		},

		//---------------------------------------------------------------------------
		// pc.drawQuesCells()    Cellの、境界線の上に描画される問題の黒マスをCanvasに書き込む
		// pc.getQuesCellColor() 問題の黒マスの設定・描画判定する
		//---------------------------------------------------------------------------
		drawQuesCells: function() {
			this.vinc("cell_front", "crispEdges", true);
			this.drawCells_common("c_fullf_", this.getQuesCellColor);
		},
		getQuesCellColor: function(cell) {
			// initialize()で上書きされる
			return null;
		},
		getQuesCellColor_ques: function(cell) {
			if (cell.ques !== 1) {
				return null;
			}
			if ((cell.error || cell.qinfo) === 1) {
				return this.errcolor1;
			}
			return this.quescolor;
		},
		getQuesCellColor_qnum: function(cell) {
			if (cell.qnum === -1) {
				return null;
			}
			if ((cell.error || cell.qinfo) === 1) {
				return this.errcolor1;
			}
			return this.quescolor;
		},

		getColorSolverAware: function (manual, solver, defaultColor) {
			if (manual && solver) {
				return this.solverqanscolor;
			} else if (solver) {
				return this.solvercolor;
			} else {
				return defaultColor || this.qanscolor;
			}
		},
		//---------------------------------------------------------------------------
		// pc.drawShadedCells()    Cellの、境界線の上から描画される回答の黒マスをCanvasに書き込む
		// pc.getShadedCellColor() 回答の黒マスの設定・描画判定する
		//---------------------------------------------------------------------------
		drawShadedCells: function() {
			this.vinc("cell_shaded", "crispEdges", true);
			this.drawCells_common("c_fulls_", this.getShadedCellColor);
		},
		getShadedCellColor: function(cell) {
			if (cell.qans !== 1 && cell.qansBySolver !== 1) {
				return null;
			}
			var hasinfo = this.board.haserror || this.board.hasinfo;
			var info = cell.error || cell.qinfo;
			if (info === 1) {
				return this.errcolor1;
			} else if (info === 2) {
				return this.errcolor2;
			} else if (cell.trial) {
				return this.trialcolor;
			} else if (this.puzzle.execConfig("irowakeblk") && !hasinfo) {
				return cell.sblk.color;
			}

			return this.getColorSolverAware(cell.qans === 1, cell.qansBySolver === 1, this.shadecolor);
		},

		//---------------------------------------------------------------------------
		// pc.drawBGCells()    Cellの、境界線の下に描画される背景色をCanvasに書き込む
		// pc.getBGCellColor() 背景色の設定・描画判定する
		//---------------------------------------------------------------------------
		drawBGCells: function() {
			this.vinc("cell_back", "crispEdges", true);
			this.drawCells_common("c_fullb_", this.getBGCellColor);
		},
		getBGCellColor: function(cell) {
			// initialize()で上書きされる
			return null;
		},
		getBGCellColor_error1: function(cell) {
			if (cell.error === 1 || cell.qinfo === 1) {
				return this.errbcolor1;
			}
			return null;
		},
		getBGCellColor_error2: function(cell) {
			var info = cell.error || cell.qinfo;
			if (info === 1) {
				return this.errbcolor1;
			} else if (info === 2) {
				return this.errbcolor2;
			}
			return null;
		},
		getBGCellColor_qcmp: function(cell) {
			if (cell.error === 1 || cell.qinfo === 1) {
				return this.errbcolor1;
			} else if (
				this.puzzle.execConfig("autocmp") &&
				!!cell.room &&
				cell.room.cmp
			) {
				return this.qcmpbgcolor;
			}
			return null;
		},
		getBGCellColor_qcmp1: function(cell) {
			if (cell.error === 1 || cell.qinfo === 1) {
				return this.errbcolor1;
			} else if (cell.qsub === 1) {
				return this.bcolor;
			} else if (
				this.puzzle.execConfig("autocmp") &&
				!!cell.room &&
				cell.room.cmp
			) {
				return this.qcmpbgcolor;
			}
			return null;
		},
		getBGCellColor_qsub1: function(cell) {
			if ((cell.error || cell.qinfo) === 1) {
				return this.errbcolor1;
			} else if (cell.qsub === 1 || cell.qsubBySolver === 1) {
				return this.bcolor;
			}
			return null;
		},
		getBGCellColor_qsub2: function(cell) {
			this.bcolor = "silver"; /* 数字入力で背景が消えないようにする応急処置 */
			if ((cell.error || cell.qinfo) === 1) {
				return this.errbcolor1;
			} else if (cell.qsub === 1) {
				return this.qsubcolor1;
			} else if (cell.qsub === 2) {
				return this.qsubcolor2;
			}
			return null;
		},
		getBGCellColor_qsub3: function(cell) {
			if ((cell.error || cell.qinfo) === 1) {
				return this.errbcolor1;
			} else if (cell.qsub === 1) {
				return this.qsubcolor1;
			} else if (cell.qsub === 2) {
				return this.qsubcolor2;
			} else if (cell.qsub === 3) {
				return this.qsubcolor3;
			}
			return null;
		},
		getBGCellColor_icebarn: function(cell) {
			if (cell.error === 1 || cell.qinfo === 1) {
				if (cell.ques === 6) {
					return this.erricecolor;
				} else {
					return this.errbcolor1;
				}
			} else if (cell.ques === 6) {
				return this.icecolor;
			}
			return null;
		},

		//---------------------------------------------------------------------------
		// pc.drawCells_common()  drawShadedCells, drawQuesCells, drawBGCellsの共通ルーチン
		//---------------------------------------------------------------------------
		drawCells_common: function(header, colorfunc) {
			var g = this.context;
			var clist = this.range.cells;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i],
					color = colorfunc.call(this, cell);
				g.vid = header + cell.id;
				if (!!color) {
					g.fillStyle = color;
					g.fillRectCenter(
						cell.bx * this.bw + this.getCellHorizontalOffset(cell),
						cell.by * this.bh,
						this.bw + 0.5,
						this.bh + 0.5
					);
				} else {
					g.vhide();
				}
			}
		},

		getCellHorizontalOffset: function(cell) {
			return 0;
		},

		//---------------------------------------------------------------------------
		// pc.drawBGExCells()    ExCellに描画される背景色をCanvasに書き込む
		// pc.getBGExCellColor() 背景色の設定・描画判定する
		//---------------------------------------------------------------------------
		drawBGExCells: function() {
			var g = this.vinc("excell_back", "crispEdges", true);

			var exlist = this.range.excells;
			for (var i = 0; i < exlist.length; i++) {
				var excell = exlist[i],
					color = this.getBGExCellColor(excell);

				g.vid = "ex_full_" + excell.id;
				if (!!color) {
					g.fillStyle = color;
					g.fillRectCenter(
						excell.bx * this.bw,
						excell.by * this.bh,
						this.bw + 0.5,
						this.bh + 0.5
					);
				} else {
					g.vhide();
				}
			}
		},

		getBGExCellColor: function(excell) {
			if (excell.error === 1 || excell.qinfo === 1) {
				return this.errbcolor1;
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawDotCells()  ・だけをCanvasに書き込む
		//---------------------------------------------------------------------------
		drawDotCells: function() {
			var g = this.vinc("cell_dot", "auto", true);

			var dsize = Math.max(this.cw * 0.06, 2);
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

		//---------------------------------------------------------------------------
		// pc.drawCellArrows() 矢印だけをCanvasに書き込む
		//---------------------------------------------------------------------------
		drawCellArrows: function(wide) {
			var g = this.vinc("cell_arrow", "auto");
			var al, aw, tl, tw;

			if (!wide) {
				al = this.cw * 0.4; // ArrowLength
				aw = this.cw * 0.03; // ArrowWidth
				tl = this.cw * 0.16; // 矢じりの長さの座標(中心-長さ)
				tw = this.cw * 0.16; // 矢じりの幅
			} else if (wide === 0.5) {
				/* 太い矢印 */
				al = this.cw * 0.35; // ArrowLength
				aw = this.cw * 0.1; // ArrowWidth
				tl = 0; // 矢じりの長さの座標(中心-長さ)
				tw = this.cw * 0.27; // 矢じりの幅
			} else {
				/* 太い矢印 */
				al = this.cw * 0.35; // ArrowLength
				aw = this.cw * 0.12; // ArrowWidth
				tl = 0; // 矢じりの長さの座標(中心-長さ)
				tw = this.cw * 0.35; // 矢じりの幅
			}
			aw = aw >= 1 ? aw : 1;
			tw = tw >= 5 ? tw : 5;

			var clist = this.range.cells;
			for (var item = 0; item < 2; item++) {
				var func =
					item === 1 ? this.getCellArrowOutline : this.getCellArrowColor;
				if (!func) {
					continue;
				}

				for (var i = 0; i < clist.length; i++) {
					var cell = clist[i],
						dir = !!cell.getArrow
							? cell.getArrow()
							: !cell.numberAsObject
							? cell.qdir
							: cell.getNum();
					var color = dir >= 1 && dir <= 4 ? func.call(this, cell) : null;

					g.vid = "c_arrow_" + item + "_" + cell.id;
					if (!!color) {
						g.lineWidth = 1.5;
						g.strokeStyle = g.fillStyle = color;
						g.beginPath();
						var px = cell.bx * this.bw,
							py = cell.by * this.bh;
						switch (dir) {
							case cell.UP:
								g.setOffsetLinePath(
									px,
									py,
									0,
									-al,
									-tw,
									-tl,
									-aw,
									-tl,
									-aw,
									al,
									aw,
									al,
									aw,
									-tl,
									tw,
									-tl,
									true
								);
								break;
							case cell.DN:
								g.setOffsetLinePath(
									px,
									py,
									0,
									al,
									-tw,
									tl,
									-aw,
									tl,
									-aw,
									-al,
									aw,
									-al,
									aw,
									tl,
									tw,
									tl,
									true
								);
								break;
							case cell.LT:
								g.setOffsetLinePath(
									px,
									py,
									-al,
									0,
									-tl,
									-tw,
									-tl,
									-aw,
									al,
									-aw,
									al,
									aw,
									-tl,
									aw,
									-tl,
									tw,
									true
								);
								break;
							case cell.RT:
								g.setOffsetLinePath(
									px,
									py,
									al,
									0,
									tl,
									-tw,
									tl,
									-aw,
									-al,
									-aw,
									-al,
									aw,
									tl,
									aw,
									tl,
									tw,
									true
								);
								break;
						}
						if (item === 1) {
							g.stroke();
						} else {
							g.fill();
						}
					} else {
						g.vhide();
					}
				}
			}
		},
		getCellArrowOutline: null,
		getCellArrowColor: function(cell) {
			var dir = !cell.numberAsObject ? cell.qdir : cell.getNum();
			if (dir >= 1 && dir <= 4) {
				if (!cell.numberAsObject || cell.qnum !== -1) {
					return this.quescolor;
				} else {
					return !cell.trial ? this.qanscolor : this.trialcolor;
				}
			}
			return null;
		},

		//---------------------------------------------------------------------------
		// pc.drawSlashes() 斜線をCanvasに書き込む
		//---------------------------------------------------------------------------
		drawSlashes: function() {
			var g = this.vinc("cell_slash", "auto");

			var basewidth = Math.max(this.bw / 4, 2);
			var irowake = this.puzzle.execConfig("irowake");

			var clist = this.range.cells;
			for (var slash = 0; slash <= 1; slash++) {
				for (var i = 0; i < clist.length; i++) {
					var cell = clist[i];
					g.vid = "c_slash_" + slash + "_" + cell.id;

					var isQues = cell.ques >= 31 && cell.ques <= 33;
					var value = isQues ? cell.ques : cell.qans;

					if (value === 33 || value === (slash ? 32 : 31)) {
						var info = cell.qinfo || cell.error,
							addwidth = 0,
							color;
						if (isQues) {
							addwidth = -basewidth / 2;
						} else if (cell.trial && this.puzzle.execConfig("irowake")) {
							addwidth = -basewidth / 2;
						} else if (
							(this.pid === "gokigen" || this.pid === "wagiri") &&
							(info === 1 || info === 3)
						) {
							addwidth = basewidth / 2;
						}

						if (isQues) {
							color = this.quescolor;
						} else if (this.pid !== "kinkonkan" && info > 0) {
							if (info & (slash ? 4 : 8)) {
								color = this.noerrcolor;
							} else if (info & 1) {
								color = this.errcolor1;
							} else if (info & 2) {
								color = this.errcolor2;
							}
						} else if (info === -1) {
							color = this.noerrcolor;
						} else if (irowake && value === 33) {
							color =
								!!slash === cell.parity() ? cell.path.color : cell.path2.color;
						} else if (irowake && cell.path && cell.path.color) {
							color = cell.path.color;
						} else if (irowake && cell.path2 && cell.path2.color) {
							color = cell.path2.color;
						} else if (cell.trial) {
							color = this.linetrialcolor;
						} else {
							color = this.linecolor;
						}

						g.lineWidth = basewidth + addwidth;
						g.strokeStyle = color;
						g.beginPath();
						var px = cell.bx * this.bw,
							py = cell.by * this.bh;
						if (!slash) {
							g.setOffsetLinePath(
								px,
								py,
								-this.bw,
								-this.bh,
								this.bw,
								this.bh,
								true
							);
						} else {
							g.setOffsetLinePath(
								px,
								py,
								this.bw,
								-this.bh,
								-this.bw,
								this.bh,
								true
							);
						}
						g.stroke();
					} else {
						g.vhide();
					}
				}
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawQuesNumbers()  Cellの問題数字をCanvasに書き込む
		// pc.drawAnsNumbers()   Cellの回答数字をCanvasに書き込む
		// pc.drawHatenas()      ques===-2の時に？をCanvasに書き込む
		// pc.getQuesNumberText()  書き込む数のテキストを取得する
		// pc.getQuesNumberColor() 問題数字の設定・描画判定する
		//---------------------------------------------------------------------------
		drawQuesNumbers: function() {
			this.vinc("cell_number", "auto");
			this.drawNumbers_com(
				this.getQuesNumberText,
				this.getQuesNumberColor,
				"cell_text_",
				this.textoption
			);
		},
		drawAnsNumbers: function() {
			this.vinc("cell_ans_number", "auto");
			this.drawNumbers_com(
				this.getAnsNumberText,
				this.getAnsNumberColor,
				"cell_ans_text_",
				{}
			);
		},
		drawSolverAnsNumbers: function() {
			this.vinc("cell_solver_ans_number", "auto");
			this.drawNumbers_com(
				this.getSolverAnsNumberText,
				this.getSolverAnsNumberColor,
				"cell_solver_ans_text_",
				{}
			);
		},
		drawHatenas: function() {
			function getQuesHatenaText(cell) {
				return cell.ques === -2 || cell.qnum === -2 ? "?" : "";
			}
			this.vinc("cell_number", "auto");
			this.drawNumbers_com(
				getQuesHatenaText,
				this.getQuesNumberColor_qnum,
				"cell_text_",
				this.textoption
			);
		},
		drawNumbers_com: function(textfunc, colorfunc, header, textoption) {
			var g = this.context;
			var clist = this.range.cells;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i];
				var text = textfunc.call(this, cell);
				g.vid = header + cell.id;
				if (!!text) {
					g.fillStyle = colorfunc.call(this, cell);
					var x = cell.bx * this.bw + this.getCellHorizontalOffset(cell);
					var y = cell.by * this.bh + this.getNumberVerticalOffset(cell);
					this.disptext(text, x, y, textoption);
				} else {
					g.vhide();
				}
			}
		},

		getNumberVerticalOffset: function(cell) {
			return 0;
		},

		getQuesNumberText: function(cell) {
			return this.getNumberText(
				cell,
				(this.puzzle.execConfig("dispmove") ? cell.base : cell).qnum
			);
		},
		getAnsNumberText: function(cell) {
			return this.getNumberText(cell, cell.anum);
		},
		getSolverAnsNumberText: function(cell) {
			if (cell.qansBySolver === 0) {
				return "";
			} else {
				return this.getNumberText(cell, cell.qansBySolver);
			}
		},
		getNumberText: function(cell, num) {
			if (!cell.numberAsLetter) {
				return this.getNumberTextCore(num);
			} else {
				return this.getNumberTextCore_letter(num);
			}
		},
		getNumberTextCore: function(num) {
			return num >= 0 ? "" + num : !this.hideHatena && num === -2 ? "?" : "";
		},
		getNumberTextCore_letter: function(num) {
			var text = "" + num;
			if (num === -1) {
				text = "";
			} else if (num === -2) {
				text = "?";
			} else if (num > 0 && num <= 26) {
				text = (num + 9).toString(36).toUpperCase();
			} else if (num > 26 && num <= 52) {
				text = (num - 17).toString(36).toLowerCase();
			}
			return text;
		},

		getQuesNumberColor: function(cell) {
			// initialize()で上書きされる
			return null;
		},
		getQuesNumberColor_fixed: function(cell) {
			return this.quescolor;
		},
		getQuesNumberColor_fixed_shaded: function(cell) {
			return this.fontShadecolor;
		},
		getQuesNumberColor_qnum: function(cell) {
			return (cell.error || cell.qinfo) === 1 ? this.errcolor1 : this.quescolor;
		},
		getQuesNumberColor_move: function(cell) {
			var puzzle = this.puzzle;
			var info = cell.error || cell.qinfo;
			if (info === 1 || info === 4) {
				return this.errcolor1;
			} else if (
				puzzle.execConfig("dispmove") &&
				puzzle.mouse.mouseCell === cell
			) {
				return this.movecolor;
			}
			return this.quescolor;
		},
		getQuesNumberColor_mixed: function(cell) {
			var info = cell.error || cell.qinfo;
			if ((cell.ques >= 1 && cell.ques <= 5) || cell.qans === 1) {
				return this.fontShadecolor;
			} else if (info === 1 || info === 4) {
				return this.errcolor1;
			}
			return this.quescolor;
		},

		getAnsNumberColor: function(cell) {
			if ((cell.error || cell.qinfo) === 1) {
				return this.errcolor1;
			}
			return !cell.trial ? this.qanscolor : this.trialcolor;
		},
		getSolverAnsNumberColor: function(cell) {
			if (!cell.trial) {
				return this.getColorSolverAware(cell.anum !== -1 && cell.anum === cell.qansBySolver, cell.qansBySolver !== 0);
			} else {
				return this.trialcolor;
			}
		},
		
		//---------------------------------------------------------------------------
		// pc.drawNumbersExCell()  ExCellの数字をCanvasに書き込む
		//---------------------------------------------------------------------------
		drawNumbersExCell: function() {
			var g = this.vinc("excell_number", "auto");

			var exlist = this.range.excells;
			for (var i = 0; i < exlist.length; i++) {
				var excell = exlist[i];
				var text = this.getQuesNumberText(excell);

				g.vid = "excell_text_" + excell.id;
				if (!!text) {
					g.fillStyle = this.getQuesNumberColor(excell);
					this.disptext(text, excell.bx * this.bw, excell.by * this.bh);
				} else {
					g.vhide();
				}
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawSubNumbers()  Cellの補助数字をCanvasに書き込む
		//---------------------------------------------------------------------------
		drawSubNumbers: function(onshade) {
			var g = this.vinc("cell_subnumber", "auto");
			var posarray = [5, 4, 2, 3];

			var clist = this.range.cells;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i];
				for (var n = 0; n < 4; n++) {
					var text = !cell.numberAsLetter
						? this.getNumberTextCore(cell.snum[n])
						: this.getNumberTextCore_letter(cell.snum[n]);
					g.vid = "cell_subtext_" + cell.id + "_" + n;
					if (!!text) {
						g.fillStyle =
							onshade && cell.isShade()
								? this.subshadecolor
								: !cell.trial
								? this.subcolor
								: this.trialcolor;
						var px = cell.bx * this.bw + this.getCellHorizontalOffset(cell);
						this.disptext(text, px, cell.by * this.bh, {
							position: posarray[n],
							ratio: 0.33,
							hoffset: 0.8
						});
					} else {
						g.vhide();
					}
				}
			}
		},

		drawCandidateNumbers: function(numCandidates) {
			// 1. 描画の準備
			const candidateContext = this.vinc("cell_candnumber", "auto");

			// セル内に作るミニグリッドの辺の長さ (例: 9個の候補なら3x3なので、gridSizeは3)
			const gridSize = Math.round(Math.sqrt(numCandidates));

			const cellsInRange = this.range.cells;

			// 2. 各セルを順番に処理
			for (const cell of cellsInRange) {
				// 現在のセルの候補数字リストを取得 (例: [true, false, true, ...])
				const candidates = cell.qcandBySolver;

				// 3. 各候補数字 (例: 1から9まで) を順番に処理
				for (let candidateIndex = 0; candidateIndex < numCandidates; candidateIndex++) {

					// 描画する各候補数字に、ユニークなIDを割り当てる
					candidateContext.vid = `cell_candtext_${cell.id}_${candidateIndex}`;

					// 候補数字リストが存在し、かつ現在の候補が表示すべきものとしてマークされているかチェック
					if (candidates && candidates[candidateIndex]) {

						// 4. 描画処理を実行
						candidateContext.fillStyle = this.solvercolor; // 描画色を設定

						// --- セル内のミニグリッド上での位置を計算 ---
						const miniGridCol = candidateIndex % gridSize;      // ミニグリッドの列 (0, 1, 2, ...)
						const miniGridRow = Math.floor(candidateIndex / gridSize); // ミニグリッドの行 (0, 1, 2, ...)

						// セルの中心を(0,0)としたときの相対的なオフセット(-1〜+1)を計算
						const offsetX = (miniGridCol + 0.5) / gridSize * 2 - 1;
						const offsetY = (miniGridRow + 0.5) / gridSize * 2 - 1;

						// 盤面全体での最終的な描画座標を計算
						const finalX = (cell.bx + offsetX) * this.bw;
						const finalY = (cell.by + offsetY) * this.bh;

						// 描画オプション (文字サイズなど) を設定
						const displayOptions = {
							ratio: (1 / gridSize) * 0.9, // 文字サイズをセルの大きさの1/gridSizeより少し小さくする
							hoffset: 0
						};

						// 実際に描画する数字 (インデックスは0からなので+1する)
						const numberToDraw = candidateIndex + 1;

						// 共通のテキスト描画関数を呼び出す
						this.disptext(String(numberToDraw), finalX, finalY, displayOptions);

					} else {
						// 5. 候補が存在しない場合は、対応する描画要素を隠す
						candidateContext.vhide();
					}
				}
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawArrowNumbers() Cellの数字と矢印をCanvasに書き込む
		//---------------------------------------------------------------------------
		drawArrowNumbers: function(opts) {
			var g = this.vinc("cell_arrownumber", "auto");

			var scale = (opts && opts.scale) || 1;

			var al = this.cw * 0.4 * scale; // ArrowLength
			var aw = this.cw * 0.03 * scale; // ArrowWidth
			var tl = this.cw * 0.16 * scale; // 矢じりの長さの座標(中心-長さ)
			var tw = this.cw * 0.12 * scale; // 矢じりの幅
			var dy = -this.bh * 0.6;
			var dx = [this.bw * 0.6, this.bw * 0.7, this.bw * 0.8, this.bw * 0.85];

			if (opts && opts.bottom) {
				dy *= -1;
			}

			var clist = this.range.cells;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i],
					dir = cell.qdir;
				var text = this.getQuesNumberText(cell);
				var px = cell.bx * this.bw,
					py = cell.by * this.bh;
				var digit = text.length - 1;

				if (!!text) {
					g.fillStyle = this.getQuesNumberColor(cell);
				}

				// 矢印の描画
				g.vid = "cell_arrow_" + cell.id;
				if (!!text && dir !== cell.NDIR) {
					g.beginPath();
					switch (dir) {
						case cell.UP:
							g.setOffsetLinePath(
								px + dx[digit] * scale,
								py,
								0,
								-al,
								-tw,
								-tl,
								-aw,
								-tl,
								-aw,
								al,
								aw,
								al,
								aw,
								-tl,
								tw,
								-tl,
								true
							);
							break;
						case cell.DN:
							g.setOffsetLinePath(
								px + dx[digit] * scale,
								py,
								0,
								al,
								-tw,
								tl,
								-aw,
								tl,
								-aw,
								-al,
								aw,
								-al,
								aw,
								tl,
								tw,
								tl,
								true
							);
							break;
						case cell.LT:
							g.setOffsetLinePath(
								px,
								py + dy,
								-al,
								0,
								-tl,
								-tw,
								-tl,
								-aw,
								al,
								-aw,
								al,
								aw,
								-tl,
								aw,
								-tl,
								tw,
								true
							);
							break;
						case cell.RT:
							g.setOffsetLinePath(
								px,
								py + dy,
								al,
								0,
								tl,
								-tw,
								tl,
								-aw,
								-al,
								-aw,
								-al,
								aw,
								tl,
								aw,
								tl,
								tw,
								true
							);
							break;
					}
					g.fill();
				} else {
					g.vhide();
				}

				// 数字の描画
				g.vid = "cell_arnum_" + cell.id;
				if (!!text) {
					var option = { ratio: this.fontsizeratio };
					if (dir !== cell.NDIR) {
						option.ratio =
							opts && opts.arrowfontsize ? opts.arrowfontsize : 0.7;
					}

					if (dir === cell.UP || dir === cell.DN) {
						px -= this.cw * 0.1;
					} else if (dir === cell.LT || dir === cell.RT) {
						py += this.ch * 0.1 * (opts && opts.bottom ? -0.5 : +1);
					}

					this.disptext(text, px, py, option);
				} else {
					g.vhide();
				}
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawCircledNumbers() Cell上の丸数字をCanvasに書き込む
		//---------------------------------------------------------------------------
		drawCircledNumbers: function() {
			this.drawCircles();

			this.vinc("cell_number", "auto");
			this.drawNumbers_com(
				this.getQuesNumberText,
				this.getQuesNumberColor,
				"cell_text_",
				{ ratio: 0.65 }
			);
		},

		//---------------------------------------------------------------------------
		// pc.drawTapaNumbers() draw Tapa-like clues
		//---------------------------------------------------------------------------
		drawTapaNumbers: function() {
			var g = this.vinc("cell_tapanum", "auto");
			var bw = this.bw,
				bh = this.bh;
			var opts = [
				{ option: {}, pos: [{ x: 0, y: 0 }] },
				{
					option: { ratio: 0.56 },
					pos: [
						{ x: -0.4, y: -0.4 },
						{ x: 0.4, y: 0.4 }
					]
				},
				{
					option: { ratio: 0.48 },
					pos: [
						{ x: -0.5, y: -0.4 },
						{ x: 0.5, y: -0.4 },
						{ x: 0, y: 0.4 }
					]
				},
				{
					option: { ratio: 0.4 },
					pos: [
						{ x: -0.55, y: 0 },
						{ x: 0, y: -0.5 },
						{ x: 0.55, y: 0 },
						{ x: 0, y: 0.5 }
					]
				}
			];

			var clist = this.range.cells;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i],
					bx = cell.bx,
					by = cell.by;
				var nums = cell.qnums,
					n = nums.length;

				for (var k = 0; k < 4; k++) {
					g.fillStyle = this.getQuesNumberColor(cell, k);
					g.vid = "cell_text_" + cell.id + "_" + k;
					if (k < n && nums[k] !== -1 && n <= 4) {
						var opt = opts[n - 1],
							px = (bx + opt.pos[k].x) * bw,
							py = (by + opt.pos[k].y) * bh;
						var text = nums[k] >= 0 ? "" + nums[k] : "?";
						this.disptext(text, px, py, opt.option);
					} else {
						g.vhide();
					}
				}
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawCrosses()    Crossの丸数字をCanvasに書き込む
		// pc.drawCrossMarks() Cross上の黒点をCanvasに書き込む
		// pc.drawCrossErrors() Cross error dots
		//---------------------------------------------------------------------------
		drawCrosses: function() {
			var g = this.vinc("cross_base", "auto", true);

			var csize = this.cw * this.crosssize + 1;
			g.lineWidth = 1;

			var option = { ratio: 0.6 };
			var clist = this.range.crosses;
			for (var i = 0; i < clist.length; i++) {
				var cross = clist[i],
					px = cross.bx * this.bw,
					py = cross.by * this.bh;

				// ○の描画
				g.vid = "x_cp_" + cross.id;
				if (cross.qnum !== -1) {
					g.fillStyle =
						cross.error === 1 || cross.qinfo === 1 ? this.errcolor1 : "white";
					g.strokeStyle = "black";
					g.shapeCircle(px, py, csize);
				} else {
					g.vhide();
				}

				// 数字の描画
				g.vid = "cross_text_" + cross.id;
				if (cross.qnum >= 0) {
					g.fillStyle = this.quescolor;
					this.disptext("" + cross.qnum, px, py, option);
				} else {
					g.vhide();
				}
			}
		},
		drawCrossMarks: function() {
			var g = this.vinc("cross_mark", "auto", true);

			var csize = this.cw * this.crosssize;
			var clist = this.range.crosses;
			for (var i = 0; i < clist.length; i++) {
				var cross = clist[i];

				g.vid = "x_cm_" + cross.id;
				if (cross.qnum === 1) {
					g.fillStyle =
						cross.error === 1 || cross.qinfo === 1
							? this.errcolor1
							: this.quescolor;
					g.fillCircle(cross.bx * this.bw, cross.by * this.bh, csize);
				} else {
					g.vhide();
				}
			}
		},
		drawCrossErrors: function(isdraw) {
			var g = this.vinc("cross_error", "auto");
			g.strokeStyle = this.errcolor1;
			g.lineWidth = Math.max(this.cw * 0.04, 1);

			var size = this.cw / 4;
			var clist = this.range.crosses;
			for (var i = 0; i < clist.length; i++) {
				var cross = clist[i];
				g.vid = "x_ce_" + cross.id;
				if (cross.error) {
					g.fillStyle = cross.lcnt === 2 ? this.errbcolor1 : "white";
					g.shapeCircle(cross.bx * this.bw, cross.by * this.bh, size / 2);
				} else {
					g.vhide();
				}
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawBorders()        境界線をCanvasに書き込む
		// pc.drawBorders_common() 境界線をCanvasに書き込む(共通処理)
		// pc.getBorderColor()     境界線の設定・描画判定する
		//---------------------------------------------------------------------------
		drawBorders: function() {
			this.vinc("border", "crispEdges", true);
			this.drawBorders_common("b_bd_");
		},
		drawBorders_common: function(header) {
			var g = this.context;

			var blist = this.range.borders;
			for (var i = 0; i < blist.length; i++) {
				var border = blist[i],
					color = this.getBorderColor(border);

				g.vid = header + border.id;
				if (!!color) {
					var px = border.bx * this.bw + this.getBorderHorizontalOffset(border),
						py = border.by * this.bh;
					var lm = (this.lw + this.addlw) / 2;
					g.fillStyle = color;
					if (border.isVert()) {
						g.fillRectCenter(px, py, lm, this.bh + lm);
					} else {
						g.fillRectCenter(px, py, this.bw + lm, lm);
					}
				} else {
					g.vhide();
				}
			}
		},

		getBorderHorizontalOffset: function(cell) {
			return 0;
		},

		getBorderColor: function(border) {
			// initialize()で上書きされる
			return null;
		},
		getBorderColor_ques: function(border) {
			if (border.isBorder()) {
				return this.quescolor;
			}
			return null;
		},
		getBorderColor_qans: function(border) {
			var err = border.error || border.qinfo;
			if (border.qans === 1 || border.qansBySolver === 1) {
				if (err === 1) {
					return this.errcolor1;
				} else if (err === -1) {
					return this.noerrcolor;
				} else if (border.trial) {
					return this.linetrialcolor;
				} else {
					return this.getColorSolverAware(border.qans === 1, border.qansBySolver === 1, this.qanscolor); // 変更点
				}
			} else if (!!border.isCmp && border.isCmp()) {
				return this.qcmpcolor;
			}
			return null;
		},
		getBorderColor_ice: function(border) {
			var cell1 = border.sidecell[0],
				cell2 = border.sidecell[1];
			if (
				border.inside &&
				!cell1.isnull &&
				!cell2.isnull &&
				cell1.ice() ^ cell2.ice()
			) {
				return this.quescolor;
			}
			return null;
		},

		//---------------------------------------------------------------------------
		// pc.drawQansBorders()    問題の境界線をCanvasに書き込む
		// pc.drawQuesBorders()    回答の境界線をCanvasに書き込む
		// pc.getQuesBorderColor() 問題の境界線の設定・描画判定する
		// pc.getQansBorderColor() 回答の境界線の設定・描画判定する
		//---------------------------------------------------------------------------
		drawQuesBorders: function() {
			this.vinc("border_question", "crispEdges", true);
			this.getBorderColor = this.getQuesBorderColor;
			this.drawBorders_common("b_bdques_");
		},
		drawQansBorders: function() {
			this.vinc("border_answer", "crispEdges", true);
			this.getBorderColor = this.getQansBorderColor;
			this.drawBorders_common("b_bdans_");
		},
		getQuesBorderColor: function(border) {
			if (border.ques >= 1) {
				return this.getBorderColor_ques(border);
			}
			return null;
		},
		getQansBorderColor: function(border) {
			if (border.qans >= 1) {
				return this.getBorderColor_qans(border);
			}
			return null;
		},

		//---------------------------------------------------------------------------
		// pc.drawBorderQsubs() 境界線用の補助記号をCanvasに書き込む
		// pc.drawBoxBorders()  境界線と黒マスの間の線を描画する
		//---------------------------------------------------------------------------
		drawBorderQsubs: function() {
			var g = this.vinc("border_qsub", "crispEdges", true);

			var m = this.cw * 0.3; //Margin
			var blist = this.range.borders;
			for (var i = 0; i < blist.length; i++) {
				var border = blist[i];

				g.vid = "b_qsub1_" + border.id;
				if (border.qsub === 1 || border.qsubBySolver === 2) {
					var px = border.bx * this.bw + this.getBorderHorizontalOffset(border),
						py = border.by * this.bh;
					g.fillStyle = this.getColorSolverAware(border.qsub === 1, border.qsubBySolver === 2, this.pekecolor); // 変更点
					var width = 1;
					if (border.isHorz()) {
						g.fillRectCenter(px, py, width, this.bh - m);
					} else {
						g.fillRectCenter(px, py, this.bw - m, width);
					}
				} else {
					g.vhide();
				}
			}
		},

		// 外枠がない場合は考慮していません
		drawBoxBorders: function(tileflag) {
			var g = this.vinc("boxborder", "crispEdges");

			var lm = this.lm;
			var cw = this.cw;
			var ch = this.ch;

			g.strokeStyle = this.bbcolor;
			g.lineWidth = 1;

			var clist = this.range.cells;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i],
					isdraw = cell.qans === 1;
				if (this.pid === "stostone" && this.board.falling) {
					isdraw = false;
				}

				g.vid = "c_bb_" + cell.id;
				if (isdraw) {
					var px = (cell.bx - 1) * this.bw,
						py = (cell.by - 1) * this.bh;
					var px0 = px - 0.5,
						px1 = px + lm + 0.5,
						px2 = px + cw - lm - 0.5,
						px3 = px + cw + 0.5;
					var py0 = py - 0.5,
						py1 = py + lm + 0.5,
						py2 = py + ch - lm - 0.5,
						py3 = py + ch + 0.5;

					// この関数を呼ぶ場合は全てhasborder===1なので
					// 外枠用の考慮部分を削除しています。
					var adb = cell.adjborder;
					var UPin = cell.by > 2,
						DNin = cell.by < 2 * this.board.rows - 2;
					var LTin = cell.bx > 2,
						RTin = cell.bx < 2 * this.board.cols - 2;

					var isUP = !UPin || adb.top.isBorder();
					var isDN = !DNin || adb.bottom.isBorder();
					var isLT = !LTin || adb.left.isBorder();
					var isRT = !RTin || adb.right.isBorder();

					var isUL =
						isUP ||
						isLT ||
						cell.relbd(-2, -1).isBorder() ||
						cell.relbd(-1, -2).isBorder();
					var isUR =
						isUP ||
						isRT ||
						cell.relbd(2, -1).isBorder() ||
						cell.relbd(1, -2).isBorder();
					var isDL =
						isDN ||
						isLT ||
						cell.relbd(-2, 1).isBorder() ||
						cell.relbd(-1, 2).isBorder();
					var isDR =
						isDN ||
						isRT ||
						cell.relbd(2, 1).isBorder() ||
						cell.relbd(1, 2).isBorder();

					g.beginPath();

					if (isUP || isUL) {
						g.moveTo(px1, py1);
					}
					if (!isUP && isUL) {
						g.lineTo(px1, py0);
					}
					if (!isUP && isUR) {
						g.moveTo(px2, py0);
					}
					if (isUP || isUR) {
						g.lineTo(px2, py1);
					} else if (isRT || isUR) {
						g.moveTo(px2, py1);
					}
					if (!isRT && isUR) {
						g.lineTo(px3, py1);
					}
					if (!isRT && isDR) {
						g.moveTo(px3, py2);
					}
					if (isRT || isDR) {
						g.lineTo(px2, py2);
					} else if (isDN || isDR) {
						g.moveTo(px2, py2);
					}
					if (!isDN && isDR) {
						g.lineTo(px2, py3);
					}
					if (!isDN && isDL) {
						g.moveTo(px1, py3);
					}
					if (isDN || isDL) {
						g.lineTo(px1, py2);
					} else if (isLT || isDL) {
						g.moveTo(px1, py2);
					}
					if (!isLT && isDL) {
						g.lineTo(px0, py2);
					}
					if (!isLT && isUL) {
						g.moveTo(px0, py1);
					}
					if (isLT || isUL) {
						g.lineTo(px1, py1);
					}

					g.stroke();
				} else {
					g.vhide();
				}
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawLines()    回答の線をCanvasに書き込む
		// pc.getLineColor() 描画する線の色を設定する
		//---------------------------------------------------------------------------
		drawLines: function() {
			var g = this.vinc("line", "crispEdges");

			var blist = this.range.borders;
			for (var i = 0; i < blist.length; i++) {
				var border = blist[i],
					color = this.getLineColor(border);

				g.vid = "b_line_" + border.id;
				if (!!color) {
					var px = border.bx * this.bw,
						py = border.by * this.bh;
					var isvert = this.board.borderAsLine === border.isVert();
					var lm = this.lm + this.addlw / 2;

					g.fillStyle = color;
					if (isvert) {
						g.fillRectCenter(px, py, lm, this.bh + lm);
					} else {
						g.fillRectCenter(px, py, this.bw + lm, lm);
					}
				} else {
					g.vhide();
				}
			}
			this.addlw = 0;
		},
		getLineColor: function(border) {
			this.addlw = 0;
			if (border.isLine() || border.isLineBySolver()) {
				var info = border.error || border.qinfo,
					puzzle = this.puzzle;
				var isIrowake =
					puzzle.execConfig("irowake") && border.path && border.path.color;
				var isDispmove = puzzle.execConfig("dispmove");

				if (border.trial && puzzle.execConfig("irowake")) {
					this.addlw = -this.lm;
				} else if (info === 1) {
					this.addlw = 1;
				}

				if (info === 1) {
					return this.errlinecolor;
				} else if (info === -1) {
					return this.noerrcolor;
				} else if (isDispmove) {
					return border.trial ? this.movetrialcolor : this.movelinecolor;
				} else if (isIrowake) {
					return border.path.color;
				} else {
					if (border.trial) {
						return this.linetrialcolor;
					}
					return this.getColorSolverAware(border.line === 1, border.lineBySolver === 1);
				}
			}
			return null;
		},

		//---------------------------------------------------------------------------
		// pc.drawTip()    動いたことを示す矢印のやじりを書き込む
		//---------------------------------------------------------------------------
		drawTip: function() {
			var g = this.vinc("cell_linetip", "auto");

			var tsize = this.cw * 0.3;
			var tplus = this.cw * 0.05;

			var clist = this.range.cells;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i],
					dir = 0,
					border = null;
				if (
					cell.lcnt === 1 &&
					!this.puzzle.execConfig("dispmove") &&
					cell.qnum === -1 &&
					/* Inverse arrow direction if a temporary departure was added by the solver */
					(cell.path.departure.anum === -1) ^ (cell.path.departure === cell)
				) {
					var adb = cell.adjborder;
					if (adb.top.isLine()) {
						dir = 2;
						border = adb.top;
					} else if (adb.bottom.isLine()) {
						dir = 1;
						border = adb.bottom;
					} else if (adb.left.isLine()) {
						dir = 4;
						border = adb.left;
					} else if (adb.right.isLine()) {
						dir = 3;
						border = adb.right;
					}
				}

				g.vid = "c_tip_" + cell.id;
				if (dir !== 0) {
					g.strokeStyle = this.getLineColor(border) || this.linecolor;
					g.lineWidth = this.lw + this.addlw; //LineWidth

					g.beginPath();
					var px = cell.bx * this.bw + 1,
						py = cell.by * this.bh + 1;
					if (dir === 1) {
						g.setOffsetLinePath(
							px,
							py,
							-tsize,
							tsize,
							0,
							-tplus,
							tsize,
							tsize,
							false
						);
					} else if (dir === 2) {
						g.setOffsetLinePath(
							px,
							py,
							-tsize,
							-tsize,
							0,
							tplus,
							tsize,
							-tsize,
							false
						);
					} else if (dir === 3) {
						g.setOffsetLinePath(
							px,
							py,
							tsize,
							-tsize,
							-tplus,
							0,
							tsize,
							tsize,
							false
						);
					} else if (dir === 4) {
						g.setOffsetLinePath(
							px,
							py,
							-tsize,
							-tsize,
							tplus,
							0,
							-tsize,
							tsize,
							false
						);
					}
					g.stroke();
				} else {
					g.vhide();
				}
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawPekes()    境界線上の×をCanvasに書き込む
		//---------------------------------------------------------------------------
		drawPekes: function() {
			var g = this.vinc("border_peke", "auto", true);

			var size = this.cw * 0.15 + 1;
			if (size < 4) {
				size = 4;
			}
			g.lineWidth = (1 + this.cw / 40) | 0;

			var blist = this.range.borders;
			for (var i = 0; i < blist.length; i++) {
				var border = blist[i];
				g.vid = "b_peke_" + border.id;
				if (border.qsub === 2 || border.qsubBySolver === 2) {
					if (!border.trial) {
						g.strokeStyle = this.getColorSolverAware(border.qsub === 2, border.qsubBySolver === 2);
					} else {
						g.strokeStyle = this.trialcolor;
					}
					g.strokeCross(border.bx * this.bw, border.by * this.bh, size - 1);
				} else {
					g.vhide();
				}
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawBaseMarks() 交点のdotをCanvasに書き込む
		//---------------------------------------------------------------------------
		drawBaseMarks: function(isdraw) {
			var g = this.vinc("cross_mark", "auto", true);
			g.fillStyle = this.quescolor;

			var size = this.cw / 10;
			var clist = this.range.crosses;
			for (var i = 0; i < clist.length; i++) {
				var cross = clist[i];
				g.vid = "x_cm_" + cross.id;
				if (isdraw !== false) {
					g.fillCircle(cross.bx * this.bw, cross.by * this.bh, size / 2);
				} else {
					g.vhide();
				}
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawTriangle()   三角形をCanvasに書き込む
		// pc.drawTriangle1()  三角形をCanvasに書き込む(1マスのみ)
		//---------------------------------------------------------------------------
		drawTriangle: function() {
			const triangleContext = this.vinc("cell_triangle", "crispEdges");
			const cellsInRange = this.range.cells;

			// --- ループ1: ソルバーによる三角形の描画（下層レイヤー） ---
			for (let i = 0; i < cellsInRange.length; i++) {
				const cell = cellsInRange[i];

				const solverAns = cell.qansBySolver;
				triangleContext.vid = `c_tri_solver_${cell.id}`;

				if (solverAns >= 2 && solverAns <= 5) {
					triangleContext.fillStyle = this.solvercolor;
					this.drawTriangle1(cell.bx * this.bw, cell.by * this.bh, solverAns);
				} else {
					triangleContext.vhide();
				}
			}

			// --- ループ2: 問題およびユーザー回答による三角形の描画（上層レイヤー） ---
			for (let i = 0; i < cellsInRange.length; i++) {
				const cell = cellsInRange[i];

				const displayAns = (cell.ques !== 0) ? cell.ques : cell.qans;
				triangleContext.vid = `c_tri_${cell.id}`;

				if (displayAns >= 2 && displayAns <= 5) {
					triangleContext.fillStyle = this.getTriangleColor(cell);
					this.drawTriangle1(cell.bx * this.bw, cell.by * this.bh, displayAns);
				} else {
					triangleContext.vhide();
				}
			}
		},
		getTriangleColor: function(cell) {
			return this.quescolor;
		},
		drawTriangle1: function(px, py, num) {
			var g = this.context;
			var mgn = this.pid === "reflect" ? 1 : 0.5,
				bw = this.bw + 1 - mgn,
				bh = this.bh + 1 - mgn;
			g.beginPath();
			switch (num) {
				case 2:
					g.setOffsetLinePath(px, py, -bw, -bh, -bw, bh, bw, bh, true);
					break;
				case 3:
					g.setOffsetLinePath(px, py, bw, -bh, -bw, bh, bw, bh, true);
					break;
				case 4:
					g.setOffsetLinePath(px, py, -bw, -bh, bw, -bh, bw, bh, true);
					break;
				case 5:
					g.setOffsetLinePath(px, py, -bw, -bh, bw, -bh, -bw, bh, true);
					break;
			}
			g.fill();
		},
		drawTriangle2: function(px, py, dir) {
			var g = this.context;
			var bw = this.bw + 1,
				bh = this.bh + 1;
			g.beginPath();
			switch (dir) {
				case 1:
					g.setOffsetLinePath(px, py, 0, 0, -bw, -bh, bw, -bh, true);
					break;
				case 2:
					g.setOffsetLinePath(px, py, 0, 0, -bw, bh, bw, bh, true);
					break;
				case 3:
					g.setOffsetLinePath(px, py, 0, 0, -bw, -bh, -bw, bh, true);
					break;
				case 4:
					g.setOffsetLinePath(px, py, 0, 0, bw, -bh, bw, bh, true);
					break;
			}
			g.fill();
		},

		//---------------------------------------------------------------------------
		// pc.drawMBs()    Cell上の○,×をCanvasに書き込む
		//---------------------------------------------------------------------------
		drawMBs: function() {
			var g = this.vinc("cell_mb", "auto", true);
			g.lineWidth = 2;

			var rsize = this.cw * 0.35;
			var clist = this.range.cells;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i],
					px,
					py;
				if (cell.qsub > 0 || cell.qsubBySolver > 0) {
					px = cell.bx * this.bw;
					py = cell.by * this.bh;
                    // g.strokeStyle = !cell.trial ? this.mbcolor : "rgb(192, 192, 192)";
				}

				g.vid = "c_MB1_" + cell.id;
				if (cell.qsub === 1 || cell.qsubBySolver === 1) {
					if (!cell.trial) {
						g.strokeStyle = this.getColorSolverAware(cell.qsub === 1, cell.qsubBySolver === 1);
					} else {
						g.strokeStyle = "rgb(192, 192, 192)";
					}
					g.strokeCircle(px, py, rsize);
				} else {
					g.vhide();
				}

				g.vid = "c_MB2_" + cell.id;
				if (cell.qsub === 2 || cell.qsubBySolver === 2) {
					if (!cell.trial) {
						g.strokeStyle = this.getColorSolverAware(cell.qsub === 2, cell.qsubBySolver === 2);
					} else {
						g.strokeStyle = "rgb(192, 192, 192)";
					}
					g.strokeCross(px, py, rsize);
				} else {
					g.vhide();
				}
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawBorderAuxDir()    directional aux marks
		//---------------------------------------------------------------------------
		drawBorderAuxDir: function() {
			var g = this.vinc("border_dirsub", "crispEdges");
			var ssize = this.cw * 0.1;

			g.lineWidth = this.cw * 0.1;

			var blist = this.range.borders;
			for (var i = 0; i < blist.length; i++) {
				var border = blist[i],
					px = border.bx * this.bw,
					py = border.by * this.bh,
					dir = border.qsub - 10;

				// 向き補助記号の描画
				g.vid = "b_daux_" + border.id;
				if (dir >= 1 && dir <= 8) {
					g.strokeStyle = !border.trial ? "rgb(64,64,64)" : this.linetrialcolor;
					this.strokeSingleAuxDir(g, dir, px, py, ssize);
				} else {
					g.vhide();
				}
			}
		},
		strokeSingleAuxDir: function(g, dir, px, py, ssize) {
			var piece = this.board.emptycell;

			switch (dir) {
				case piece.UP:
					g.setOffsetLinePath(
						px,
						py,
						-ssize * 2,
						+ssize,
						0,
						-ssize,
						+ssize * 2,
						+ssize,
						false
					);
					break;
				case piece.DN:
					g.setOffsetLinePath(
						px,
						py,
						-ssize * 2,
						-ssize,
						0,
						+ssize,
						+ssize * 2,
						-ssize,
						false
					);
					break;
				case piece.LT:
					g.setOffsetLinePath(
						px,
						py,
						+ssize,
						-ssize * 2,
						-ssize,
						0,
						+ssize,
						+ssize * 2,
						false
					);
					break;
				case piece.RT:
					g.setOffsetLinePath(
						px,
						py,
						-ssize,
						-ssize * 2,
						+ssize,
						0,
						-ssize,
						+ssize * 2,
						false
					);
					break;
			}
			g.stroke();
		},

		//---------------------------------------------------------------------------
		// pc.drawCircles()          数字や白丸黒丸等を表すCellの丸を書き込む
		// pc.getCircleStrokeColor() 描画する円の線の色を設定する
		// pc.getCircleFillColor()   描画する円の背景色を設定する
		//---------------------------------------------------------------------------
		drawCircles: function() {
			var g = this.vinc("cell_circle", "auto", true);

			var ra = this.circleratio;
			var rsize_stroke = (this.cw * (ra[0] + ra[1])) / 2,
				rsize_fill = this.cw * ra[0];

			var clist = this.range.cells;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i];

				var color = this.getCircleFillColor(cell);
				g.vid = "c_cirb_" + cell.id;
				if (!!color) {
					g.fillStyle = color;
					g.fillCircle(
						cell.bx * this.bw + this.getCellHorizontalOffset(cell),
						cell.by * this.bh,
						rsize_fill
					);
				} else {
					g.vhide();
				}
			}

			g = this.vinc("cell_circle_stroke", "auto", true);
			g.lineWidth = Math.max(this.cw * (ra[0] - ra[1]), 1);

			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i];

				var color = this.getCircleStrokeColor(cell);
				g.vid = "c_cira_" + cell.id;
				if (!!color) {
					g.strokeStyle = color;
					g.strokeCircle(
						cell.bx * this.bw + this.getCellHorizontalOffset(cell),
						cell.by * this.bh,
						rsize_stroke
					);
				} else {
					g.vhide();
				}
			}
		},

		getCircleStrokeColor: function(cell) {
			// initialize()で上書きされる
			return null;
		},
		getCircleStrokeColor_qnum: function(cell) {
			var puzzle = this.puzzle,
				error = cell.error || cell.qinfo;
			var isdrawmove = puzzle.execConfig("dispmove");
			var num = (!isdrawmove ? cell : cell.base).qnum;
			if (num !== -1) {
				if (isdrawmove && puzzle.mouse.mouseCell === cell) {
					return this.movecolor;
				} else if (error === 1 || error === 4) {
					return this.errcolor1;
				} else {
					return this.quescolor;
				}
			}
			return null;
		},
		getCircleStrokeColor_qnum2: function(cell) {
			if (cell.qnum === 1) {
				return cell.error === 1 ? this.errcolor1 : this.quescolor;
			}
			return null;
		},

		getCircleFillColor: function(cell) {
			// initialize()で上書きされる
			return null;
		},
		getCircleFillColor_qnum: function(cell) {
			if (cell.qnum !== -1) {
				var error = cell.error || cell.qinfo;
				if (error === 1 || error === 4) {
					return this.errbcolor1;
				} else {
					return this.circlebasecolor;
				}
			}
			return null;
		},
		getCircleFillColor_qnum2: function(cell) {
			if (cell.qnum === 1) {
				return cell.error === 1 ? this.errbcolor1 : "white";
			} else if (cell.qnum === 2) {
				return cell.error === 1 ? this.errcolor1 : this.quescolor;
			}
			return null;
		},
		getCircleFillColor_qcmp: function(cell) {
			var puzzle = this.puzzle,
				error = cell.error || cell.qinfo;
			var isdrawmove = puzzle.execConfig("dispmove");
			var num = (!isdrawmove ? cell : cell.base).qnum;
			if (num !== -1) {
				if (error === 1 || error === 4) {
					return this.errbcolor1;
				} else if (cell.isCmp()) {
					return this.qcmpcolor;
				} else {
					return this.circlebasecolor;
				}
			}
			return null;
		},

		//---------------------------------------------------------------------------
		// pc.drawDepartures()    移動系パズルで、移動元を示す記号を書き込む
		//---------------------------------------------------------------------------
		drawDepartures: function() {
			var g = this.vinc("cell_depart", "auto", true);
			g.fillStyle = this.movelinecolor;

			var rsize = this.cw * 0.15;
			var isdrawmove = this.puzzle.execConfig("dispmove");
			var clist = this.range.cells;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i];

				g.vid = "c_dcir_" + cell.id;
				if (isdrawmove && cell.isDeparture()) {
					var px = cell.bx * this.bw,
						py = cell.by * this.bh;
					g.fillCircle(px, py, rsize);
				} else {
					g.vhide();
				}
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawLineParts()   ╋などをCanvasに書き込む
		//---------------------------------------------------------------------------
		drawLineParts: function() {
			var g = this.vinc("cell_lineparts", "crispEdges");
			g.fillStyle = this.quescolor;

			var lm = this.lm,
				bw = this.bw,
				bh = this.bh;
			var clist = this.range.cells;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i],
					qu = cell.ques;

				g.vid = "c_lp_" + cell.id;
				if (qu >= 11 && qu <= 17) {
					var px = cell.bx * this.bw,
						py = cell.by * this.bh;
					var px0 = px - bw - 0.5,
						px1 = px - lm,
						px2 = px + lm,
						px3 = px + bw + 0.5;
					var py0 = py - bh - 0.5,
						py1 = py - lm,
						py2 = py + lm,
						py3 = py + bh + 0.5;

					var flag = { 11: 15, 12: 3, 13: 12, 14: 9, 15: 5, 16: 6, 17: 10 }[qu];
					g.beginPath();
					g.moveTo(px1, py1);
					if (flag & 1) {
						g.lineTo(px1, py0);
						g.lineTo(px2, py0);
					} // top
					g.lineTo(px2, py1);
					if (flag & 8) {
						g.lineTo(px3, py1);
						g.lineTo(px3, py2);
					} // right
					g.lineTo(px2, py2);
					if (flag & 2) {
						g.lineTo(px2, py3);
						g.lineTo(px1, py3);
					} // bottom
					g.lineTo(px1, py2);
					if (flag & 4) {
						g.lineTo(px0, py2);
						g.lineTo(px0, py1);
					} // left
					g.closePath();
					g.fill();
				} else {
					g.vhide();
				}
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawTateyokos()   縦棒・横棒をCanvasに書き込む
		// pc.getBarColor()     縦棒・横棒の色を取得する
		//---------------------------------------------------------------------------
		drawTateyokos: function() {
			var g = this.vinc("cell_tateyoko", "crispEdges");
			var lm = Math.max(this.cw / 6, 3) / 2; //LineWidth

			var clist = this.range.cells;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i],
					px = cell.bx * this.bw,
					py = cell.by * this.bh;
				var qa = cell.qans;

				g.vid = "c_bar1_" + cell.id;
				if (qa === 11 || qa === 12) {
					g.fillStyle = this.getBarColor(cell, true);
					g.fillRectCenter(px, py, lm + this.addlw / 2, this.bh);
				} else {
					g.vhide();
				}

				g.vid = "c_bar2_" + cell.id;
				if (qa === 11 || qa === 13) {
					g.fillStyle = this.getBarColor(cell, false);
					g.fillRectCenter(px, py, this.bw, lm + this.addlw / 2);
				} else {
					g.vhide();
				}
			}
			this.addlw = 0;
		},

		getBarColor: function(cell, vert) {
			var err = cell.error,
				isErr =
					err === 1 || err === 4 || (err === 5 && vert) || (err === 6 && !vert),
				color = "";
			this.addlw = 0;
			if (isErr) {
				color = this.errlinecolor;
				this.addlw = 1;
			} else if (err !== 0) {
				color = this.noerrcolor;
			} else if (cell.trial) {
				color = this.linetrialcolor;
			} else {
				color = this.linecolor;
			}
			return color;
		},

		//---------------------------------------------------------------------------
		// pc.drawQues51()         Ques===51があるようなパズルで、描画関数を呼び出す
		// pc.drawSlash51Cells()   [＼]のナナメ線をCanvasに書き込む
		// pc.drawSlash51ExCells() ExCell上の[＼]のナナメ線をCanvasに書き込む
		// pc.drawExCellGrid()     ExCell間の境界線をCanvasに書き込む
		//---------------------------------------------------------------------------
		drawQues51: function() {
			this.drawExCellGrid();
			this.drawTargetTriangle();
			this.drawSlash51Cells();
			this.drawSlash51ExCells();
		},
		drawSlash51Cells: function() {
			var g = this.vinc("cell_ques51", "crispEdges", true);

			g.strokeStyle = this.quescolor;
			g.lineWidth = 1;
			var clist = this.range.cells;
			for (var i = 0; i < clist.length; i++) {
				var cell = clist[i];

				g.vid = "c_slash51_" + cell.id;
				if (cell.ques === 51) {
					var px = cell.bx * this.bw,
						py = cell.by * this.bh;
					g.strokeLine(px - this.bw, py - this.bh, px + this.bw, py + this.bh);
				} else {
					g.vhide();
				}

				g.vid = "c_slash51b_" + cell.id;
				if (cell.ques === 51 && cell.dirs51 === 4) {
					var px = cell.bx * this.bw,
						py = cell.by * this.bh;
					g.strokeLine(px - this.bw, py + this.bh, px + this.bw, py - this.bh);
				} else {
					g.vhide();
				}
			}
		},
		drawSlash51ExCells: function() {
			var g = this.vinc("excell_ques51", "crispEdges", true);

			g.strokeStyle = this.quescolor;
			g.lineWidth = 1;
			var exlist = this.range.excells;
			for (var i = 0; i < exlist.length; i++) {
				var excell = exlist[i],
					px = excell.bx * this.bw,
					py = excell.by * this.bh;
				g.vid = "ex_slash51_" + excell.id;
				g.strokeLine(px - this.bw, py - this.bh, px + this.bw, py + this.bh);
			}
		},
		drawExCellGrid: function() {
			var g = this.vinc("grid_excell", "crispEdges", true);

			g.fillStyle = this.quescolor;
			var exlist = this.range.excells;
			for (var i = 0; i < exlist.length; i++) {
				var excell = exlist[i];
				var px = excell.bx * this.bw,
					py = excell.by * this.bh;

				g.vid = "ex_bdx_" + excell.id;
				if (excell.by === -1 && excell.bx < this.board.maxbx) {
					g.fillRectCenter(px + this.bw, py, 0.5, this.bh);
				} else {
					g.vhide();
				}

				g.vid = "ex_bdy_" + excell.id;
				if (excell.bx === -1 && excell.by < this.board.maxby) {
					g.fillRectCenter(px, py + this.bh, this.bw, 0.5);
				} else {
					g.vhide();
				}
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawQuesNumbersOn51()   [＼]に数字を記入する
		// pc.drawQuesNumbersOn51_1() 1つの[＼]に数字を記入する
		//---------------------------------------------------------------------------
		drawQuesNumbersOn51: function() {
			this.vinc("cell_number51", "auto");

			var d = this.range;
			for (var bx = d.x1 | 1; bx <= d.x2; bx += 2) {
				for (var by = d.y1 | 1; by <= d.y2; by += 2) {
					var piece = this.board.getobj(bx, by); /* cell or excell */
					if (!piece.isnull) {
						if (piece.dirs51 === 4) {
							this.drawQuesNumbersOn51_2(piece);
						} else {
							this.drawQuesNumbersOn51_1(piece);
						}
					}
				}
			}
		},
		drawQuesNumbersOn51_1: function(piece) {
			/* cell or excell */
			var g = this.context,
				val,
				adj,
				px = piece.bx * this.bw,
				py = piece.by * this.bh;
			var option = { ratio: 0.45 };
			g.fillStyle =
				piece.error === 1 || piece.qinfo === 1
					? this.errcolor1
					: this.quescolor;

			adj = piece.relcell(2, 0);
			val = piece.ques === 51 ? piece.qnum : -1;

			g.vid = [piece.group, piece.id, "text_ques51_rt"].join("_");
			if (val >= 0 && !adj.isnull && adj.ques !== 51) {
				option.position = this.TOPRIGHT;
				this.disptext("" + val, px, py, option);
			} else {
				g.vhide();
			}

			adj = piece.relcell(0, 2);
			val = piece.ques === 51 ? piece.qnum2 : -1;

			g.vid = [piece.group, piece.id, "text_ques51_dn"].join("_");
			if (val >= 0 && !adj.isnull && adj.ques !== 51) {
				option.position = this.BOTTOMLEFT;
				this.disptext("" + val, px, py, option);
			} else {
				g.vhide();
			}
		},
		drawQuesNumbersOn51_2: function(piece) {
			var g = this.context,
				val,
				px = piece.bx * this.bw,
				py = piece.by * this.bh;
			var option = { ratio: 0.4, width: [0.35, 0.23, 0.15] };
			g.fillStyle =
				piece.error === 1 || piece.qinfo === 1
					? this.errcolor1
					: this.quescolor;

			for (var dir = 1; dir <= 4; dir++) {
				val = piece.getQnumDir(dir);
				g.vid = [piece.group, piece.id, "text_ques51", dir].join("_");
				if (val >= 0) {
					option.position = dir + 5;
					this.disptext("" + val, px, py, option);
				} else {
					g.vhide();
				}
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawTarget()  入力対象となる場所を描画する
		// pc.drawCursor()  キーボードからの入力対象をCanvasに書き込む
		// pc.drawTargetSubNumber() Cellの補助数字の入力対象に背景色をつける
		// pc.drawTargetTriangle() [＼]のうち入力対象のほうに背景色をつける
		//---------------------------------------------------------------------------
		drawTarget: function() {
			this.drawCursor(true, this.puzzle.editmode);
		},

		drawCursor: function(islarge, isdraw) {
			this.drawRawCursor(
				"target_cursor",
				"",
				this.puzzle.cursor,
				islarge,
				isdraw !== false && this.puzzle.getConfig("cursor"),
				this.puzzle.editmode ? this.targetColorEdit : this.targetColorPlay
			);
		},

		drawTrialStarts: function() {
			var starts = this.puzzle.opemgr.savedStarts;
			for (var i = 0; i < starts.length; i++) {
				var piece = starts[i];
				this.drawRawCursor(
					"trial_cursor",
					"trial_" + i,
					piece,
					false,
					!piece.isnull && this.puzzle.getConfig("trialmarker"),
					this.targetColorTrial
				);
			}
		},

		drawRawCursor: function(layerid, prefix, cursor, islarge, isdraw, color) {
			var g = this.vinc(layerid, "crispEdges");

			var px = cursor.bx * this.bw,
				py = cursor.by * this.bh;

			var obj = !cursor.group ? cursor.getobj() : cursor;

			if (obj && obj.group === "cell") {
				px += this.getCellHorizontalOffset(obj);
			} else if (obj && obj.group === "border") {
				px += this.getBorderHorizontalOffset(obj);
			}

			var t, w, h;
			if (islarge !== false) {
				t = Math.max(this.cw / 16, 2) | 0;
				w = this.bw - 0.5;
				h = w;
			} else {
				t = Math.max(this.cw / 24, 1) | 0;
				w = this.bw * 0.56;
				h = w;
			}

			if (typeof cursor.bankpiece === "number") {
				var piece = this.board.bank.pieces[cursor.bankpiece];
				if (cursor.bankpiece === this.board.bank.pieces.length) {
					piece = this.board.bank.addButton;
				}
				if (piece) {
					var r = this.puzzle.painter.bankratio;

					px = (piece.x + 0.25 + piece.w / 2) * this.cw * r;
					py = (piece.y + 0.25 + piece.h / 2) * this.ch * r;
					py += (this.board.rows + this.bankVerticalOffset) * this.ch;
					w = (piece.w + 0.25) * this.cw * r * 0.5;
					h = (piece.h + 0.25) * this.ch * r * 0.5;
				} else {
					isdraw = false;
				}
			}

			isdraw = isdraw !== false && !this.outputImage;
			g.fillStyle = color;

			g.vid = prefix + "ti1_";
			if (isdraw) {
				g.fillRect(px - w, py - h, w * 2, t);
			} else {
				g.vhide();
			}
			g.vid = prefix + "ti2_";
			if (isdraw) {
				g.fillRect(px - w, py - h, t, h * 2);
			} else {
				g.vhide();
			}
			g.vid = prefix + "ti3_";
			if (isdraw) {
				g.fillRect(px - w, py + h - t, w * 2, t);
			} else {
				g.vhide();
			}
			g.vid = prefix + "ti4_";
			if (isdraw) {
				g.fillRect(px + w - t, py - h, t, h * 2);
			} else {
				g.vhide();
			}
		},

		drawTargetSubNumber: function(onshade) {
			var g = this.vinc("target_subnum", "crispEdges");

			var d = this.range,
				cursor = this.puzzle.cursor;
			if (cursor.bx < d.x1 || d.x2 < cursor.bx) {
				return;
			}
			if (cursor.by < d.y1 || d.y2 < cursor.by) {
				return;
			}

			var target = cursor.targetdir;
			var cell = cursor.getc();

			if (
				cursor.disableAnum &&
				this.puzzle.mouse.inputMode.indexOf("number") === -1
			) {
				target = 0;
			}

			g.vid = "target_subnum";
			g.fillStyle =
				onshade && cell && cell.isShade() ? this.ttshadecolor : this.ttcolor;
			if (this.puzzle.playmode && target !== 0) {
				var bw = this.bw,
					bh = this.bh;
				var px = cursor.bx * bw + 0.5 + this.getCellHorizontalOffset(cell),
					py = cursor.by * bh + 0.5;
				var tw = bw * 0.8,
					th = bh * 0.8;
				if (target === 5) {
					g.fillRect(px - bw, py - bh, tw, th);
				} else if (target === 4) {
					g.fillRect(px + bw - tw, py - bh, tw, th);
				} else if (target === 2) {
					g.fillRect(px - bw, py + bh - th, tw, th);
				} else if (target === 3) {
					g.fillRect(px + bw - tw, py + bh - th, tw, th);
				}
			} else {
				g.vhide();
			}
		},
		drawTargetTriangle: function() {
			var g = this.vinc("target_triangle", "auto");

			var d = this.range,
				cursor = this.puzzle.cursor;
			if (cursor.bx < d.x1 || d.x2 < cursor.bx) {
				return;
			}
			if (cursor.by < d.y1 || d.y2 < cursor.by) {
				return;
			}

			var target = cursor.detectTarget();

			g.vid = "target_triangle";
			g.fillStyle = this.ttcolor;
			if (this.puzzle.editmode && target !== 0) {
				if (cursor.targetdirs === 4) {
					this.drawTriangle2(cursor.bx * this.bw, cursor.by * this.bh, target);
				} else {
					this.drawTriangle1(
						cursor.bx * this.bw,
						cursor.by * this.bh,
						target === 4 ? 4 : 2
					);
				}
			} else {
				g.vhide();
			}
		},

		//--------------------------------------------------------------------------
		// pc.drawStartGoal()  draw Start and Goal symbols
		//--------------------------------------------------------------------------
		drawStartGoal: function() {
			var g = this.vinc("cell_sg", "auto");
			var bd = this.board,
				d = this.range;

			g.vid = "text_stpos";
			var cell = bd.startpos ? bd.startpos.getc() : bd.emptycell;
			if (
				cell.bx >= d.x1 &&
				d.x2 >= cell.bx &&
				cell.by >= d.y1 &&
				d.y2 >= cell.by
			) {
				if (!cell.isnull) {
					g.fillStyle =
						this.puzzle.mouse.draggingSG && this.puzzle.mouse.inputData === 10
							? "red"
							: cell.qans === 1
							? this.fontShadecolor
							: this.quescolor;
					this.disptext("S", cell.bx * this.bw, cell.by * this.bh);
				} else {
					g.vhide();
				}
			}

			g.vid = "text_glpos";
			cell = bd.goalpos.getc();
			if (
				cell.bx >= d.x1 &&
				d.x2 >= cell.bx &&
				cell.by >= d.y1 &&
				d.y2 >= cell.by
			) {
				if (!cell.isnull) {
					g.fillStyle =
						this.puzzle.mouse.draggingSG && this.puzzle.mouse.inputData === 11
							? "red"
							: cell.qans === 1
							? this.fontShadecolor
							: this.quescolor;
					this.disptext("G", cell.bx * this.bw, cell.by * this.bh);
				} else {
					g.vhide();
				}
			}
		},

		fillStar: function(g, px, py, sizeX, sizeY) {
			// 星を描画するときの頂点の位置
			var starXOffset = [
				0,
				0.235,
				0.95,
				0.38,
				0.588,
				0,
				-0.588,
				-0.38,
				-0.95,
				-0.235
			];
			var starYOffset = [
				-1,
				-0.309,
				-0.309,
				0.124,
				0.809,
				0.4,
				0.809,
				0.124,
				-0.309,
				-0.309
			];

			g.beginPath();
			g.moveTo(px, py - sizeY);
			for (var p = 1; p < 10; p++) {
				g.lineTo(px + sizeX * starXOffset[p], py + sizeY * starYOffset[p]);
			}
			g.closePath();
			g.fill();
		},

		//--------------------------------------------------------------------------
		// pc.getDotFillColor()  The circle fill color, or null for no fill.
		// pc.getDotOutlineColor()  The circle outline color, or null for no outline.
		// pc.getDotRadius()  The circle radius, as a fraction.
		// pc.drawDots()  Draw circles on all dot positions
		//--------------------------------------------------------------------------
		getDotFillColor: function(dot) {
			if (dot.getDot() === 1) {
				return "white";
			}
			if (dot.getDot() === 2) {
				return dot.iserror() ? this.errcolor1 : this.quescolor;
			}
			return null;
		},
		getDotOutlineColor: function(dot) {
			if (dot.getDot() === 1) {
				return dot.iserror() ? this.errcolor1 : this.quescolor;
			}
			return null;
		},
		getDotRadius: function(dot) {
			return 0.18;
		},

		drawDots: function() {
			var g = this.vinc("dot", "auto");

			g.lineWidth = Math.max(this.cw * 0.04, 1);
			var d = this.range;
			var dlist = this.board.dotinside(d.x1, d.y1, d.x2, d.y2);
			for (var i = 0; i < dlist.length; i++) {
				var dot = dlist[i],
					bx = dot.bx,
					by = dot.by;

				g.vid = "s_dot_" + dot.id;
				var outline = this.getDotOutlineColor(dot);
				var color = this.getDotFillColor(dot);
				if (!!color || !!outline) {
					g.strokeStyle = outline;
					g.fillStyle = color;
					g.shapeCircle(
						bx * this.bw,
						by * this.bh,
						this.cw * this.getDotRadius(dot)
					);
				} else {
					g.vhide();
				}
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawDashedCenterLines() セルの中心から中心にひかれる点線をCanvasに描画する
		//---------------------------------------------------------------------------
		drawDashedCenterLines: function() {
			var g = this.vinc("centerline", "crispEdges", true),
				bd = this.board;

			var x1 = this.range.x1,
				y1 = this.range.y1,
				x2 = this.range.x2,
				y2 = this.range.y2;
			if (x1 < bd.minbx + 1) {
				x1 = bd.minbx + 1;
			}
			if (x2 > bd.maxbx - 1) {
				x2 = bd.maxbx - 1;
			}
			if (y1 < bd.minby + 1) {
				y1 = bd.minby + 1;
			}
			if (y2 > bd.maxby - 1) {
				y2 = bd.maxby - 1;
			}
			x1 -= ~x1 & 1;
			y1 -= ~y1 & 1;
			x2 += ~x2 & 1;
			y2 += ~y2 & 1; /* (x1,y1)-(x2,y2)を外側の奇数範囲まで広げる */

			var dasharray = this.getDashArray();

			g.lineWidth = 1;
			g.strokeStyle = this.gridcolor;
			for (var i = x1; i <= x2; i += 2) {
				var px = i * this.bw,
					py1 = y1 * this.bh,
					py2 = y2 * this.bh;
				g.vid = "cliney_" + i;
				g.strokeDashedLine(px, py1, px, py2, dasharray);
			}
			for (var i = y1; i <= y2; i += 2) {
				var py = i * this.bh,
					px1 = x1 * this.bw,
					px2 = x2 * this.bw;
				g.vid = "clinex_" + i;
				g.strokeDashedLine(px1, py, px2, py, dasharray);
			}
		},

		getDashArray: function() {
			var dashCount = Math.max(Math.round(this.cw / 10), 4);
			var stepSize = this.cw / dashCount;
			var lengthOn = (5 / 8) * stepSize;
			var lengthOff = stepSize - lengthOn;

			var dasharray = [];
			dasharray.push(lengthOn / 2, lengthOff);
			for (var i = 0; i < dashCount - 1; i++) {
				dasharray.push(lengthOn, lengthOff);
			}
			dasharray.push(lengthOn / 2);
			dasharray.push(0);
			return dasharray;
		},

		//---------------------------------------------------------------------------
		// pc.drawGrid()        セルの枠線(実線)をCanvasに書き込む
		// pc.drawDashedGrid()  セルの枠線(点線)をCanvasに書き込む
		//---------------------------------------------------------------------------
		drawGrid: function(haschassis, isdraw) {
			var g = this.vinc("grid", "crispEdges", true),
				bd = this.board;

			// ignore excells
			var minx = Math.max(bd.minbx, 0),
				maxx = Math.min(bd.maxbx, 2 * bd.cols);
			var miny = Math.max(bd.minby, 0),
				maxy = Math.min(bd.maxby, 2 * bd.rows);

			// 外枠まで描画するわけじゃないので、maxbxとか使いません
			var x1 = this.range.x1,
				y1 = this.range.y1,
				x2 = this.range.x2,
				y2 = this.range.y2;
			if (x1 < minx) {
				x1 = minx;
			}
			if (x2 > maxx) {
				x2 = maxx;
			}
			if (y1 < miny) {
				y1 = miny;
			}
			if (y2 > maxy) {
				y2 = maxy;
			}
			x1 -= x1 & 1;
			y1 -= y1 & 1; /* (x1,y1)を外側の偶数位置に移動する */
			if (x1 >= x2 || y1 >= y2) {
				return;
			}

			var bs = bd.hasborder !== 2 && haschassis !== false ? 2 : 0,
				bw = this.bw,
				bh = this.bh;
			var xa = Math.max(x1, minx + bs),
				xb = Math.min(x2, maxx - bs);
			var ya = Math.max(y1, miny + bs),
				yb = Math.min(y2, maxy - bs);

			// isdraw!==false: 指定無しかtrueのときは描画する
			g.lineWidth = this.gw;
			g.strokeStyle = this.gridcolor;
			for (var i = xa; i <= xb; i += 2) {
				g.vid = "bdy_" + i;
				if (isdraw !== false) {
					var px = i * bw,
						py1 = y1 * bh,
						py2 = y2 * bh;
					g.strokeLine(px, py1, px, py2);
				} else {
					g.vhide();
				}
			}
			for (var i = ya; i <= yb; i += 2) {
				g.vid = "bdx_" + i;
				if (isdraw !== false) {
					var py = i * bh,
						px1 = x1 * bw,
						px2 = x2 * bw;
					g.strokeLine(px1, py, px2, py);
				} else {
					g.vhide();
				}
			}
		},
		drawDashedGrid: function(haschassis) {
			var g = this.vinc("grid", "crispEdges", true),
				bd = this.board;

			// ignore excells
			var minx = Math.max(bd.minbx, 0),
				maxx = Math.min(bd.maxbx, 2 * bd.cols);
			var miny = Math.max(bd.minby, 0),
				maxy = Math.min(bd.maxby, 2 * bd.rows);

			// 外枠まで描画するわけじゃないので、maxbxとか使いません
			var x1 = this.range.x1,
				y1 = this.range.y1,
				x2 = this.range.x2,
				y2 = this.range.y2;
			if (x1 < minx) {
				x1 = minx;
			}
			if (x2 > maxx) {
				x2 = maxx;
			}
			if (y1 < miny) {
				y1 = miny;
			}
			if (y2 > maxy) {
				y2 = maxy;
			}
			x1 -= x1 & 1;
			y1 -= y1 & 1;
			x2 += x2 & 1;
			y2 += y2 & 1; /* (x1,y1)-(x2,y2)を外側の偶数範囲に移動する */

			var dasharray = this.getDashArray();

			var bs = haschassis !== false ? 2 : 0,
				bw = this.bw,
				bh = this.bh;
			var xa = Math.max(x1, minx + bs),
				xb = Math.min(x2, maxx - bs);
			var ya = Math.max(y1, miny + bs),
				yb = Math.min(y2, maxy - bs);

			g.lineWidth = this.gw;
			g.strokeStyle = this.gridcolor;
			for (var i = xa; i <= xb; i += 2) {
				var px = i * bw,
					py1 = y1 * bh,
					py2 = y2 * bh;
				g.vid = "bdy_" + i;
				g.strokeDashedLine(px, py1, px, py2, dasharray);
			}
			for (var i = ya; i <= yb; i += 2) {
				var py = i * bh,
					px1 = x1 * bw,
					px2 = x2 * bw;
				g.vid = "bdx_" + i;
				g.strokeDashedLine(px1, py, px2, py, dasharray);
			}
		},

		//---------------------------------------------------------------------------
		// pc.drawChassis()     外枠をCanvasに書き込む
		// pc.drawChassis_ex1() bd.hasexcell==1の時の外枠をCanvasに書き込む
		//---------------------------------------------------------------------------
		drawChassis: function(withexcell) {
			var g = this.vinc("chassis", "crispEdges", true),
				bd = this.board;

			var exWidth = withexcell ? bd.minbx * -0.5 * this.cw : 0;
			var exHeight = withexcell ? bd.minby * -0.5 * this.ch : 0;

			var boardWidth = bd.cols * this.cw,
				boardHeight = bd.rows * this.ch;
			var lw = this.lw,
				lm = this.lm;
			if (this.pid === "bosanowa") {
				lw = 1;
				lm = 0.5;
			}
			g.fillStyle = this.quescolor;
			g.vid = "chs1_";
			g.fillRect(-lm, -exHeight - lm, lw, boardHeight + exHeight + lw);
			g.vid = "chs2_";
			g.fillRect(
				boardWidth - lm,
				-exHeight - lm,
				lw,
				boardHeight + exHeight + lw
			);
			g.vid = "chs3_";
			g.fillRect(-exWidth - lm, -lm, boardWidth + exWidth + lw, lw);
			g.vid = "chs4_";
			g.fillRect(
				-exWidth - lm,
				boardHeight - lm,
				boardWidth + exWidth + lw,
				lw
			);
		},
		drawChassis_ex1: function(boldflag) {
			var g = this.vinc("chassis_ex1", "crispEdges", true),
				bd = this.board;

			var x1 = this.range.x1,
				y1 = this.range.y1,
				x2 = this.range.x2,
				y2 = this.range.y2;
			if (x1 <= 0) {
				x1 = bd.minbx;
			}
			if (x2 > bd.maxbx) {
				x2 = bd.maxbx;
			}
			if (y1 <= 0) {
				y1 = bd.minby;
			}
			if (y2 > bd.maxby) {
				y2 = bd.maxby;
			}

			var lw = this.lw,
				lm = this.lm;
			var boardWidth = bd.cols * this.cw,
				boardHeight = bd.rows * this.ch;

			// extendcell==1も含んだ外枠の描画
			g.fillStyle = this.quescolor;
			g.vid = "chsex1_1_";
			g.fillRect(-this.cw - lm, -this.ch - lm, lw, boardHeight + this.ch + lw);
			g.vid = "chsex1_2_";
			g.fillRect(
				boardWidth - lm,
				-this.ch - lm,
				lw,
				boardHeight + this.ch + lw
			);
			g.vid = "chsex1_3_";
			g.fillRect(-this.cw - lm, -this.ch - lm, boardWidth + this.cw + lw, lw);
			g.vid = "chsex1_4_";
			g.fillRect(
				-this.cw - lm,
				boardHeight - lm,
				boardWidth + this.cw + lw,
				lw
			);

			// 通常のセルとextendcell==1の間の描画
			if (boldflag) {
				// すべて太線で描画する場合
				g.vid = "chs1_";
				g.fillRect(-lm, -lm, lw, boardHeight + lw - 1);
				g.vid = "chs2_";
				g.fillRect(-lm, -lm, boardWidth + lw - 1, lw);
			} else {
				// ques==51のセルが隣接している時に細線を描画する場合
				g.vid = "chs1_";
				g.fillRect(-0.5, -0.5, 1, boardHeight);
				g.vid = "chs2_";
				g.fillRect(-0.5, -0.5, boardWidth, 1);

				var clist = this.range.cells;
				for (var i = 0; i < clist.length; i++) {
					var cell = clist[i],
						px = (cell.bx - 1) * this.bw,
						py = (cell.by - 1) * this.bh;

					if (cell.bx === 1) {
						g.vid = "chs1_sub_" + cell.by;
						if (cell.ques !== 51) {
							g.fillRect(-lm, py - lm, lw, this.ch + lw);
						} else {
							g.vhide();
						}
					}

					if (cell.by === 1) {
						g.vid = "chs2_sub_" + cell.bx;
						if (cell.ques !== 51) {
							g.fillRect(px - lm, -lm, this.cw + lw, lw);
						} else {
							g.vhide();
						}
					}
				}
			}
		},

		lastBankPieceCount: 0,
		drawBank: function() {
			if (
				!this.showBank ||
				(!this.range.bank && this.range.bankPieces.length === 0)
			) {
				return;
			}

			var g = this.vinc("piecebank"),
				bd = this.board;

			var count = Math.max(bd.bank.pieces.length, this.lastBankPieceCount);

			for (var p = 0; p < count; p++) {
				var piece = bd.bank.pieces[p];
				if (!this.range.bank && this.range.bankPieces.indexOf(piece) === -1) {
					continue;
				}

				this.drawBankPiece(g, piece, p);
			}

			this.drawBankAddButton();

			this.lastBankPieceCount = bd.bank.pieces.length;
		},
		drawBankPiece: function(g, piece, idx) {},
		getBankPieceColor: function(piece) {
			return piece.error
				? this.errcolor1
				: piece.qcmp
				? this.qcmpcolor
				: this.quescolor;
		},
		drawBankAddButton: function() {
			var g = this.vinc("piecebank_add", "crispEdges"),
				bd = this.board,
				addButton = bd.bank.addButton;
			var showAdd =
				this.puzzle.editmode &&
				!this.outputImage &&
				addButton.index !== null &&
				(this.range.bank || this.range.bankPieces.indexOf(addButton) !== -1);

			if (
				addButton.index !== null &&
				(this.range.bank || this.range.bankPieces.indexOf(addButton) !== -1)
			) {
				var r = this.bankratio;
				var px = this.cw * r * (addButton.x + 0.25) + 1;
				var py = this.ch * r * (addButton.y + 0.25) + 1;
				py += (this.board.rows + this.bankVerticalOffset) * this.ch;
				var px2 = px + this.cw * r * addButton.w - 1;
				var py2 = py + this.ch * r * addButton.h - 1;
				for (var i = 0; i < 4; i++) {
					g.vid = "pb_piece_add_" + i;
					if (showAdd) {
						g.strokeStyle = "blue";
						g.strokeDashedLine(
							i < 2 ? px : px2,
							i < 2 ? py : py2,
							i % 2 ? px : px2,
							i % 2 ? py2 : py,
							[3]
						);
					} else {
						g.vhide();
					}
				}

				g.vid = "pb_piece_add_symbol";
				if (showAdd) {
					g.fillStyle = "blue";
					var option = { style: "bold" };
					this.disptext(
						"+",
						px + 0.5 * r * this.cw * addButton.w,
						py + 0.5 * r * this.ch * addButton.h,
						option
					);
				} else {
					g.vhide();
				}
			}
		}
	}
});
