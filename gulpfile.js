"use strict";
const gulp = require("gulp");
// const { task, src, dest } = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const replace = require("gulp-replace");
const del = require("del");
const banner = require("gulp-header");
const pkg = require("./package.json");
const { argv } = require("node:process");
const { exec } = require("node:child_process");

const COPY_RIGHT =
	"(C) 2015 - 2023 Open Source Matters,Inc. All right reserved.";

const LINK_DOCBLOCK_LONG = `http://git.akhi.ir/js/SHDate | ${pkg.homepage}`;

const INFO_DOCBLOCK_LONG = [
	`/**
	* In the name of Allah, the Beneficent, the Merciful.
	* @package ${pkg.name} - ${pkg.description}
	* @author ${pkg.author}
	* @link ${LINK_DOCBLOCK_LONG}
	* @copyright ${COPY_RIGHT}
	* @license ${pkg.license} License
	* @version Release: ${pkg.version}
	*/
	`
].join("\n");

const INFO_DOCBLOCK_SHORT = [
	`/** In the name of Allah. | ${pkg.name}@${pkg.version} | ${COPY_RIGHT} | ${pkg.license} License | ${LINK_DOCBLOCK_LONG} */`
].join("\n");

function replaceDocBlockInfo() {
	/**
	 * In the name of Allah, the Beneficent, the Merciful. | \* In the name of Allah, the Beneficent, the Merciful\./im;
	 */
	return gulp
		.src(["src/**/*.ts"])
		.pipe(
			replace(
				/\* @(package( [\w\/\-\,\{\}@\(\)]+)+)/g,
				`* @package ${pkg.name} - ${pkg.description}`
			)
		)
		.pipe(
			replace(
				/\* @(author( [\w\/\-\,\{\}@<>\.\(\):]+)+)/g,
				`* @author ${pkg.author}`
			)
		)
		.pipe(
			replace(/\* @(link( [\w:\/\.\|#-]+)+)/g, `* @link ${LINK_DOCBLOCK_LONG}`)
		)
		.pipe(
			replace(
				/\* @(copyright( [\w\d.\(\)\-\,]+)+)/g,
				`* @copyright ${COPY_RIGHT}`
			)
		)
		.pipe(
			replace(
				/\* @(license( [\w\d:\/.\(\)\-]+)+)/g,
				`* @license ${pkg.license} License`
			)
		)
		.pipe(
			replace(
				/\* @(version( [\w\d:\/\.\-]+)+)/g,
				`* @version Release: ${pkg.version}`
			)
		)
		.pipe(
			replace(
				/VERSION: string = "([\w\d:\/\.\-]+)"/g,
				`VERSION: string = "${pkg.version}"`
			)
		)
		.pipe(gulp.dest("src/"));
}

function cleanCompile(cb) {
	return del(
		[
			"dist"
			// , "src/browser"
		],
		cb
	);
}
/**
 * combine all .ts files into one
 */
function concatBrowserTS() {
	return (
		gulp
			.src([
				"node_modules/shdate/dist/browser/shdate.ts",
				"src/languages/**/*.ts",
				"src/selection.ts",
				"src/word.ts",
				"src/base.ts"
			])
			.pipe(concat("shcalendar.ts"))
			.pipe(replace(/export (default)?/g, ""))
			.pipe(replace(/import [a-zA-Z_,{ }]* from [0-9a-zA-Z_\/\.\"]*;/g, ""))
			.pipe(
				replace(
					/(Languages?|Word|SelectionType|Selection)(\.)?/g,
					"SHCalendar$1$2"
				)
			)
			.pipe(replace(/ ([a-z]{2,3}_[A-Z]{2})(\.)?/g, " SHCalendarLanguage_$1$2"))
			// .pipe(banner('import SHDate from "shdate";'))
			.pipe(gulp.dest("src/browser"))
	);
}
function compileBrowser(cb) {
	//"tsc:browser"
	return exec("tsc --project tsconfig.json", function (err, stdout, stderr) {
		// console.log(stdout);
		// console.log(stderr);
		cb(err);
	});
}
function cleanBrowserTS(cb) {
	return del(["src/browser"], cb);
}
function compressBrowserJS() {
	return gulp
		.src("dist/shcalendar.js", {
			sourcemaps: true
		})
		.pipe(replace(/_a/g, "_SHDate"))
		.pipe(replace(/_b/g, "_SHCalendar"))
		.pipe(babel({ presets: ["@babel/env"] }))
		.pipe(banner(INFO_DOCBLOCK_LONG))
		.pipe(gulp.dest("dist"))
		.pipe(babel({ presets: ["@babel/env"] }))
		.pipe(replace(/_a/g, "_SHDate"))
		.pipe(replace(/_b/g, "_SHCalendar"))
		.pipe(uglify())
		.pipe(rename({ extname: ".min.js" }))
		.pipe(banner(INFO_DOCBLOCK_SHORT))
		.pipe(gulp.dest("./dist", { sourcemaps: "." }));
}

/**
 * Run default.
 */
exports.default = gulp.task(
	"build",
	gulp.series(
		cleanCompile,
		concatBrowserTS,
		compileBrowser,
		compressBrowserJS,
		// cleanBrowserTS,
		replaceDocBlockInfo
	)
);
function cleanTest(cb) {
	return del(["dist/test"], cb);
}

function copyTestBrowser(cb) {
	return gulp.src(["test/browser/*"]).pipe(gulp.dest("dist/test/browser"));
}
function installTestBrowser(cb) {
	return exec(
		"(cd dist/test/browser && npm i && npm test)",
		function (err, stdout, stderr) {
			// console.log(stdout);
			// console.log(stderr);
			cb(err);
		}
	);
}

gulp.task("test", gulp.series(cleanTest, copyTestBrowser, installTestBrowser));

gulp.task("testRelease", gulp.series(cleanTest));
