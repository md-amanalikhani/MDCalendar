"use strict";
const gulp = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const replace = require("gulp-replace");
const del = require("del");
const banner = require("gulp-header");
const pkg = require("./package.json");

/**
 * combine all .ts files into one
 */
function combineTS() {
	return gulp
		.src([
			"./node_modules/@md-akhi/shdatetime/dist/types/shdatetime.ts",
			"src/i18n/*.ts",
			"src/word.ts",
			"src/selection.ts",
			"src/index.ts"
		])
		.pipe(concat("shcalendar.ts"))
		.pipe(replace(/class ([a-z]{2}_[A-Z]{2})/g, "class SHCalendarLanguage_$1"))
		.pipe(replace(/export default (function|class)/g, "$1"))
		.pipe(replace(/import [a-zA-z_]+ from [0-9a-zA-z_/\.\"@]+;/g, " "))
		.pipe(replace(/import [A-Za-z]+ from [\"@a-z-\/]+;/g, ""))
		.pipe(replace(/ ([a-z]{2}_[A-Z]{2})\./g, " SHCalendarLanguage_$1."))
		.pipe(replace(/ Language_([a-z]{2}_[A-Z]{2})/g, " SHCalendarLanguage_$1"))
		.pipe(replace(/class (Word|Selection)/g, "class SHCalendar$1"))
		.pipe(replace(/ (Word|Selection)(\.|\()/g, " SHCalendar$1$2"))
		.pipe(replace(/enum (Language)/g, "enum SHCalendar$1"))
		.pipe(replace(/ Language.([a-z]{2}_[A-Z]{2})/g, " SHCalendarLanguage.$1"))
		.pipe(gulp.dest("src/browser"));
}

function browser() {
	return gulp
		.src("dist/shcalendar.js", { sourcemaps: true })
		.pipe(babel({ presets: ["@babel/env"] }))
		.pipe(gulp.dest("dist"))
		.pipe(uglify())
		.pipe(rename({ extname: ".min.js" }))
		.pipe(gulp.dest("dist", { sourcemaps: "." }));
}

function combineLibJS() {
	var infoLong = [
		"/**",
		"* In the name of Allah, the Beneficent, the Merciful.",
		`* @package ${pkg.name} - ${pkg.description}`,
		`* @author ${pkg.author}`,
		"* @link http://codehub.akhi.ir/js/SHCalendar",
		"* @copyright Copyright (C) 2015 - 2022 . All right reserved.",
		`* @license https://www.gnu.org/licenses/agpl-3.0.en.html ${pkg.license} License`,
		`* @version Release: ${pkg.version}`,
		"*/"
	].join("\n");
	return gulp
		.src([
			"./node_modules/@md-akhi/shdatetime/dist/browser/shdatetime.js",
			"dist/shcalendar.js"
		])
		.pipe(concat("shcalendar.js"))
		.pipe(banner(infoLong))
		.pipe(gulp.dest("dist"));
}

function combineLibJSMin() {
	var infoShort = [
		`/** In the name of Allah. | ${pkg.name}@${pkg.version} | (C) 2015 - 2022 All right reserved. | ${pkg.license} | http://codehub.akhi.ir/js/SHCalendar */`,
		""
	].join("\n");
	return gulp
		.src([
			"./node_modules/@md-akhi/shdatetime/dist/browser/shdatetime.min.js",
			"dist/shcalendar.min.js"
		])
		.pipe(concat("shcalendar.min.js"))
		.pipe(banner(infoShort))
		.pipe(gulp.dest("dist"));
}

function delTSBrowser() {
	return del(["src/browser"]);
}

/**
 * Run default.
 */
exports.default = gulp.series(
	browser,
	combineLibJS,
	combineLibJSMin,
	delTSBrowser
);
exports.combineTS = combineTS;
