#!/bin/bash

git checkout --orphan gh-pages || {
    echo "Failed to checkout to new branch gh-pages. Attempting to delete possible existing branch..."

    git branch -D gh-pages || {
        echo "Failed to delete gh-pages branch"
        exit 1
    }

    git checkout --orphan gh-pages || {
        echo "Failed again to checkout to empty gh-pages, abandoning process"
        exit 2
    }
}
