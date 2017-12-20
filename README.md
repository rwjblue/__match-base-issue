# Demonstration of eslint/eslint#9740

The new `overrides` feature added in ESLint 4.1.0 is _awesome_ (massively
better than "sprinkling" config around in a repo or in specific files via
comments). Unfortunately, there is a hole in the `overrides` support due to a
small implementation decision.

When the overrides are processed to determine if each individual override
matches or does not match a given file, the [`matchBase`
option](https://github.com/isaacs/minimatch#matchbase) is passed in to
[minimatch](https://github.com/isaacs/minimatch) and the includes/excludes are processed.

The code that does this [can be found
here](https://github.com/eslint/eslint/blob/8e1a095f4cc3b371a0a424b66e13ec77734193a2/lib/config/config-ops.js#L362-L381),
but is also included below for explanation purposes:

```js
function pathMatchesGlobs(filePath, patterns, excludedPatterns) {
  const patternList = [].concat(patterns);
  const excludedPatternList = [].concat(excludedPatterns || []);

  patternList.concat(excludedPatternList).forEach(pattern => {
    if (path.isAbsolute(pattern) || pattern.includes("..")) {
      throw new Error(`Invalid override pattern (expected relative path not containing '..'): ${pattern}`);
    }
  });

  const opts = { matchBase: true };

  return patternList.some(pattern => minimatch(filePath, pattern, opts)) &&
    !excludedPatternList.some(excludedPattern => minimatch(filePath, excludedPattern, opts));
}
```

The usage of `matchBase: true` to `minimatch` means that patterns without a `/`
in them will be matched against the `filePath`s base name (i.e.
`path.basename(filePath)`). This allows matching "all JS files" as simple as
`*.js` instead of using `**/*.js`. Unfortunately, this means that it is now
impossible to match files in the project root without _also_ matching nested
files with the same base name.
