# [enderman.dev][website]

> My personal website.

This branch contains the version of my website made using [Academic Pages][academic-pages].

<!-- Link aliases -->

[website]: https://enderman.dev

<!-- References -->

[academic-pages]: https://github.com/academicpages/academicpages.github.io?tab=readme-ov-file

## Building the Site

To build the site from Markdown to HTML and CSS:

1. Make sure you have Ruby and Bundler installed:
   ```bash
   sudo apt-get install ruby-full build-essential zlib1g-dev
   sudo gem install bundler jekyll
   ```

2. Install dependencies:
   ```bash
   bundle install
   ```

3. Build the site:
   ```bash
   ./scripts/build.sh
   ```
   This will generate the site in the `_site` directory.

4. To run a local development server:
   ```bash
   bundle exec jekyll serve --livereload
   ```
   Then visit http://localhost:4000 in your browser.

## Directory Structure

- `_data/`: Contains site data files like navigation
- `_pages/`: Contains Markdown files for pages
- `_posts/`: Blog posts
- `_publications/`: Publication entries
- `_talks/`: Talks/presentations
- `_portfolio/`: Portfolio items
- `images/`: Image files
- `_config.yml`: Configuration for Jekyll and the theme

## Customization

Edit the `_config.yml` file to update personal information. Create new markdown files in the appropriate directories to add content.

## Deployment

The site is automatically built and deployed using GitHub Pages when changes are pushed to the main branch.
