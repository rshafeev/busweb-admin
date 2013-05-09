/*************************************************************************
 *
 * Copyright:
 * Bus.Admin-lib is copyright (c) 2012, {@link http://ways.in.ua} Inc. All Rights Reserved. 
 *
 * License:
 * Bus.Admin-lib is free software, licensed under the MIT license. 
 * See the file {@link http://api.ways.in.ua/license.txt|license.txt} in this distribution for more details.
 *
 * Authors:
 * Roman Shafeyev (rs@premiumgis.com)
 *
 *************************************************************************/

/**
 * Тестирование класса {@link bus.admin.helpers.LanguageHelper}
 */
 qx.Class.define("bus.admin.test.helpers.LanguageHelperTest",
 {
  extend : qx.dev.unit.TestCase,
  construct: function()
  {
    this.base(arguments);
  },

  members :
  {


    /*
    ---------------------------------------------------------------------------
      TESTS
    ---------------------------------------------------------------------------
    */

    /**
     * Проверим функцию транслитерации
     */
     testTranslit : function()
     {
      this.debug("execute testTranslit()");
      var helper  = bus.admin.helpers.LanguageHelper;
      this.assertEquals("abd", helper.translit("абд"), "Translitaration was failed");
      this.assertEquals("abd rt", helper.translit("абд рт"), "Translitaration with space was failed ");
      this.assertEquals("ABD rT english", helper.translit("АБД рТ english"), "Translitaration with case was failed ");

      this.assertEquals("sch sh ch ts yu ya yo zh ' i e a b v g d e z i i k l m n o p r s t u f h", 
        helper.translit("щ ш ч ц ю я ё ж ъ ы э а б в г д е з и й к л м н о п р с т у ф х"),
        "Full translitaration was failed");

    },

    /**
     * Проверим функцию транслитерации кириллицы в латиницу 
     */
     testRetranslit : function()
     {
      this.debug("execute testRetranslit()");
      var helper  = bus.admin.helpers.LanguageHelper;
      this.assertEquals("абд", helper.retranslit("abd"), "Retranslitaration was failed");
      this.assertEquals("абд рт", helper.retranslit("abd rt"), "Retranslitaration with space was failed ");
      this.assertEquals("АБД рТ русский текст", helper.retranslit("ABD rT русский текст"), "Retranslitaration with case was failed ");

    },

    /**
     * Проверим функцию транслитерации в русские символы
     */
     testTranslitToRU : function()
     {
      this.debug("execute testTranslitToRU()");
      var helper  = bus.admin.helpers.LanguageHelper;
      this.assertEquals("Перевод на русский. Русский текст", helper.translitToRU("Perevod na russkiy. Русский текст"), "translitToRU was failed");
    },

    /**
     * Проверим функцию транслитерации в украинские символы
     */
     testTranslitToUK : function()
     {
      this.debug("execute testTranslitToUK()");
      var helper  = bus.admin.helpers.LanguageHelper;
      this.assertEquals("Перевод на украинский. Первiй елемент массива", 
       helper.translitToUK("Perevod na ukrainskiy. Первый элемент массива"), 
       "translitToRU was failed");
    }


  }
});
