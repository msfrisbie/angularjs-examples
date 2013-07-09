# `$digest()`

This is intended to demonstrate how digest works inside the AngularJS runtime.

## `$apply()`

`$apply()` is called to enter the Angular execution context. The 1.1.5 source code for `$apply()` is as follows:

```javascript
$apply: function(expr) {
  try {
    beginPhase('$apply');
    return this.$eval(expr);
  } catch (e) {
    $exceptionHandler(e);
  } finally {
    clearPhase();
    try {
      $rootScope.$digest();
    } catch (e) {
      $exceptionHandler(e);
      throw e;
    }
  }
}
```

`$apply()` is used to execute an expression in angular from outside of the angular framework. (For example from browser DOM events, setTimeout, XHR or third party libraries).

We see that, after evaluating the `expr` parameter and handling exceptions thrown by it, it invokes `$rootScope.$digest()`. This 'digest loop' cycles through the evalAsync queue and the $watch list until the DOM is stabilized.

In this example, we can gain some insight into when $digest is called.

As detailed in the docs, it is possible to register a $watch on all $digest calls by passing it a single parameter, the callback function. The callback executes on all $digest invocations application-wide.

Opening the application and examine the console.

After the config finishes, the controller will obviously be instantiated.
Inside it, we declare a variable and a function, which are not of interest at this time, we register a $watch on all $digest calls, and we set a $timeout. We can see that $digest is invoked twice, this is due to the $watch listener being registered.

When the timeout executes, it will invoke the make_request function, which contains an $http request.

Following this we see that two more calls to $digest are invoked. Both XHR and $timeout actions will call $digest.

Additionally, we can see that clicking the button will invoke $digest. `ng-click`, though not formally tied to anything, invokes $digest.

Finally, entering text in the `<input>` will also invoke $digest. In AngularJS, because of the implementation of data-binding, the model can be treated as the 'single-source-of-truth' in the application, and so whenever the model is modified, as we are doing here, $digest must be invoked to propagate and possible changes throughout the application or views.
