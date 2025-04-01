#!/bin/bash

set -e

echo "Building the Jekyll site..."
JEKYLL_ENV=production bundle exec jekyll build

echo "Creating gh-pages branch..."
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

echo "Cleaning up branch..."
find . -maxdepth 1 ! -name '_site' ! -name '.git' ! -name '.gitignore' ! -name '.gitmodules' ! -name 'CNAME' -exec rm -rf {} \;

echo "Moving built site to root..."
mv _site/* .
rm -rf _site

if [ ! -f CNAME ]; then
    echo "enderman.dev" > CNAME
fi

echo "Adding files to git..."
git add -A .

echo "Committing changes..."
git commit -m "Deploy to GitHub Pages: $(date)" || {
    echo "Nothing to commit"
    git checkout main
    exit 0
}

echo "Pushing to GitHub..."
git push -f origin gh-pages

echo "Switching back to main branch..."
git checkout academic-page

echo "Cleaning up..."
git restore ./
git clean -fxd

echo "Git file system check:"
git fsck

git prune --expire=now
git gc --prune --aggressive

echo "After cleaning up:"
git fsck

echo "Deployment completed successfully!"
