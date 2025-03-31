#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Build the site
echo "Building the Jekyll site..."
JEKYLL_ENV=production bundle exec jekyll build

# Create and switch to gh-pages branch
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

# Remove everything except _site directory
echo "Cleaning up branch..."
find . -maxdepth 1 ! -name '_site' ! -name '.git' ! -name '.gitignore' ! -name '.gitmodules' ! -name 'CNAME' -exec rm -rf {} \;

# Move contents of _site to root
echo "Moving built site to root..."
mv _site/* .
rm -rf _site

# Add CNAME file if doesn't exist
if [ ! -f CNAME ]; then
    echo "enderman.dev" > CNAME
fi

# Add all files
echo "Adding files to git..."
git add -A .

# Commit changes
echo "Committing changes..."
git commit -m "Deploy to GitHub Pages: $(date)" || {
    echo "Nothing to commit"
    git checkout main
    exit 0
}

# Push to remote
echo "Pushing to GitHub..."
git push -f origin gh-pages

# Switch back to main branch
echo "Switching back to main branch..."
git checkout main

echo "Cleaning up..."
git restore ./
git clean -fxd

echo "Deployment completed successfully!"
