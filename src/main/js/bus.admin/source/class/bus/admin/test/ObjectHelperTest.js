/* ************************************************************************

   Copyright:

   License:

   Authors:

   ************************************************************************ */

/**
 * This class demonstrates how to define unit tests for your application.
 *
 * Execute <code>generate.py test</code> to generate a testrunner application 
 * and open it from <tt>test/index.html</tt>
 *
 * The methods that contain the tests are instance methods with a 
 * <code>test</code> prefix. You can create an arbitrary number of test 
 * classes like this one. They can be organized in a regular class hierarchy, 
 * i.e. using deeper namespaces and a corresponding file structure within the 
 * <tt>test</tt> folder.
 */
 qx.Class.define("bus.admin.test.ObjectHelperTest",
 {
  extend : qx.dev.unit.TestCase,

  members :
  {
    /*
    ---------------------------------------------------------------------------
      TESTS
    ---------------------------------------------------------------------------
    */

    /**
     * Here are some simple tests
     */
     testSimple : function()
     {
      String s = "test str";
      String copy = bus.admin.helpers.ObjectHelper.clone(s);
      this.assertEquals(s, copy,  "This should never fail!");
    }

  }
});
