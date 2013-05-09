/*************************************************************************
 *
 * Copyright:
 * Bus.Admin-lib is copyright (c) 2012, {@link http://ways.in.ua} Inc. All Rights Reserved. 
 *
 * License:
 * Bus.Admin-lib is free software, licensed under the MIT license. 
 * See the file {@link http://api.ways.in.ua/license.txt license.txt} in this distribution for more details.
 *
 * Authors:
 * Roman Shafeyev (rs@premiumgis.com)
 *
 *************************************************************************/

/**
 * Класс {@link bus.admin.helpers.LanguageHelper} включает в себя языковые функции. 
 * С помощью данного класса можно выполнять транслитерацию в обоих направлениях.
 */
 qx.Class.define("bus.admin.helpers.LanguageHelper", {
 	type : "static",

 	statics : {

 		/**
 		 * Транслирует кириллицу в латиницу
 		 * @param  cirillicText {String}   Входной текст, который может в себя включать как латинские так и кириллистические символы
 		 * @return {String}  Текст из латинских символов
 		 */
 		 translit : function(cirillicText)
 		 {
 		 	var A = new Array();
 		 	A["Ё"]="YO";A["Й"]="I";A["Ц"]="TS";A["У"]="U";A["К"]="K";A["Е"]="E";A["Н"]="N";A["Г"]="G";A["Ш"]="SH";A["Щ"]="SCH";A["З"]="Z";A["Х"]="H";A["Ъ"]="'";
 		 	A["ё"]="yo";A["й"]="i";A["ц"]="ts";A["у"]="u";A["к"]="k";A["е"]="e";A["н"]="n";A["г"]="g";A["ш"]="sh";A["щ"]="sch";A["з"]="z";A["х"]="h";A["ъ"]="'";
 		 	A["Ф"]="F";A["Ы"]="I";A["В"]="V";A["А"]="A";A["П"]="P";A["Р"]="R";A["О"]="O";A["Л"]="L";A["Д"]="D";A["Ж"]="ZH";A["Э"]="E";
 		 	A["ф"]="f";A["ы"]="i";A["в"]="v";A["а"]="a";A["п"]="p";A["р"]="r";A["о"]="o";A["л"]="l";A["д"]="d";A["ж"]="zh";A["э"]="e";
 		 	A["Я"]="YA";A["Ч"]="CH";A["С"]="S";A["М"]="M";A["И"]="I";A["Т"]="T";A["Ь"]="'";A["Б"]="B";A["Ю"]="YU";
 		 	A["я"]="ya";A["ч"]="ch";A["с"]="s";A["м"]="m";A["и"]="i";A["т"]="t";A["ь"]="'";A["б"]="b";A["ю"]="yu";
 		 	var text = cirillicText.toString();
 		 	var latinText = text.replace(/([\u0410-\u0451])/g,
 		 		function (str,p1,offset,s) {
 		 			if (A[str] != undefined){return A[str];}
 		 			else
 		 				return str;
 		 		}

 		 		);
 		 	return latinText;
 		 },

 		/**
 		 * Транслирует латиницу в кириллицу
 		 * @param  latinText {String}   Входной текст, который может в себя включать как латинские так и кириллистические символы
 		 * @return {String}   Транслированный текст в кириллицу
 		 */
 		 retranslit : function(latinText)
 		 {
 		 	var A = new Array();
 		 	A["YO"]="Ё"; A["I"]="Й";  A["TS"]="Ц"; A["U"]="У"; A["K"]="К"; A["E"]="Е"; A["N"]="Н"; A["G"]="Г";A["SH"]="Ш"; A["SCH"]="Щ";A["Z"]="З";A["H"]="Х";
 		 	A["yo"]="ё"; A["i"]="й";  A["ts"]="ц"; A["u"]="у"; A["k"]="к"; A["e"]="е"; A["n"]="н"; A["g"]="г";A["sh"]="ш"; A["sch"]="щ";A["z"]="з";A["h"]="х";
 		 	A["F"]="Ф";  A["V"]="В";  A["A"]="А"; A["P"]="П"; A["R"]="Р"; A["O"]="О"; A["L"]="Л";A["D"]="Д";  A["ZH"]="Ж";
 		 	A["f"]="ф";  A["v"]="в";  A["a"]="а"; A["p"]="п"; A["r"]="р"; A["o"]="о"; A["l"]="л";A["d"]="д";  A["zh"]="ж";
 		 	A["YA"]="Я"; A["CH"]="Ч"; A["S"]="С";  A["M"]="М"; A["I"]="И"; A["T"]="Т"; A["'"]="Ь"; A["B"]="Б";A["YU"]="Ю";
 		 	A["ya"]="я"; A["ch"]="ч"; A["s"]="с";  A["m"]="м"; A["i"]="и"; A["t"]="т"; A["b"]="б"; A["yu"]="ю";
 		 	A["y"] = "й";
 		 	var text = latinText.toString();
 		 	var cirillicText = text.replace(/([a-zA-Z])/g,
 		 		function (str,p1,offset,s) {
 		 			if (A[str] != undefined){return A[str];}
 		 			else
 		 				return str;
 		 		}
 		 		);
 		 	return cirillicText;
 		 },

 		/**
 		 * Выполняет транслитерацию латинских символов в кириллицу.
 		 * @param  text {String}   Входной текст, который может в себя включать как латинские так и кириллистические символы
 		 * @return {String}     Транслированный текст в кириллицу
 		 */
 		 translitToRU : function(text){
 		 	var ruText = bus.admin.helpers.LanguageHelper.retranslit(text);
 		 	return ruText;
 		 },

 		/**
 		 * Выполняет транслитерацию латинских символов в кириллицу с учетом украинского алфавита.(ы => i, э => е)
 		 * @param  text {String}  Входной текст, который может в себя включать как латинские так и кириллистические символы
 		 * @return {String}  Строка, состоящая из символов украинского алфавита
 		 */
 		 translitToUK : function(text){
 		 	var ruText = bus.admin.helpers.LanguageHelper.retranslit(text);
 		 	var A = new Array();
 		 	A["ы"]="i"; A["э"]="е";
 		 	var uaText = ruText.replace(/([\u0410-\u0451])/g,
 		 		function (str,p1,offset,s) {
 		 			if (A[str] != undefined){return A[str];}
 		 			else
 		 				return str;
 		 		}
 		 		);
 		 	return uaText;		
 		 }, 

 		/**
 		 * Выполняет транслитерацию  кириллицы в латинские символы.
 		 * @param  text {String}  Входной текст, который может в себя включать как латинские так и кириллистические символы
 		 * @return {String}   Строка, состоящая из латинских символов 
 		 */
 		 translitToEN : function(text){
 		 	return bus.admin.helpers.LanguageHelper.translit(text);
 		 },

 		/**
 		 * Выполняет транслитерацию  в заданный язык.
 		 * @param  text {String}  Входной текст, который может в себя включать как латинские так и кириллистические символы
 		 * @param langID {String} Идентификатор языка: ru, en, uk
 		 * @return {String}   Строка, состоящая из символов заданного языка 
 		 */
 		 translitToLang : function(text, langID){
 		 	if(langID == "uk")
 		 		return bus.admin.helpers.LanguageHelper.translitToUK(text);
 		 	if(langID == "ru")
 		 		return bus.admin.helpers.LanguageHelper.translitToRU(text);
 		 	return bus.admin.helpers.LanguageHelper.translitToEN(text);	
 		 }


 		}
 	});
