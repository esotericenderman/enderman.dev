# [enderman.dev][website]

> My personal website.

This branch contains the version of my website made using [Academic Pages][academic-pages].

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

3. To run a local development server:
   ```bash
   ./scripts/run.sh
   ```
   Then visit http://localhost:4000 in your browser.

## Directory Structure

- `_data/`: Contains site data files like navigation
- `images/`: Image files
- `_config.yml`: Configuration for Jekyll and the theme

## Customization

Edit the `_config.yml` file to update personal information. Create new markdown files in the appropriate directories to add content.

## License

&copy; 2024-2025 [Esoteric Enderman][website]

[enderman.dev][website] is licensed under the [AGPL 3.0][license] only.

<!-- Link aliases -->

[website]: https://enderman.dev

<!-- Files -->

[license]: ./LICENSE

<!-- References -->

[academic-pages]: https://github.com/academicpages/academicpages.github.io?tab=readme-ov-file
