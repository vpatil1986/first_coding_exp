# Changelog

## Unreleased

- test: skip mongoose connect during tests; set NODE_ENV in test script (#2)
  - Prevents tests from opening a live MongoDB connection which caused the
    test runner to hang. Added logic to skip `mongoose.connect()` when
    `NODE_ENV=test`, and updated the `test` script to set `NODE_ENV=test`.
