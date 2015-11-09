"use strict";

module.exports = function (grunt) {

    //project configuration
    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %>\n' +
        '* Copyright (c) <%= pkg.author.name %>;' +
        '*/\n\n',
        resourcePath: './resource/', //资源文件目录
        docsDistPath: './docs/', //示例的编译版本目录
        superTableDistPath: './dist/', //supertable.js的编译版本目录

        // 任务配置信息

        // Grunt任务开始前的清理工作
        clean: {
            main: [
                "<%=superTableDistPath%>",
                "<%=docsDistPath%>*",
                "!<%=docsDistPath%>ueditor", //编辑器不必删除
                "!<%=docsDistPath%>*.md"
            ]
        },

        // 文件合并
        concat: {
            options: {
                banner: "<%=banner%>"
            },
            supertable: {
                options: {
                    separator: ';\n'
                },
                files: {
                    '<%=superTableDistPath%>supertable.js': [
                        '<%=resourcePath%>js/supertable/supertable.js'
                    ]
                }
            },
            docsjs: {
                options: {
                    separator: ';\n'
                },
                files: {
                    '<%=docsDistPath%>js/global.js': [
                        '<%=resourcePath%>js/docs/core.js',
                        '<%=resourcePath%>js/docs/index.js'
                    ]
                }
            }
        },

        // js文件压缩
        uglify: {
            options: {
                banner: "<%=banner%>",
            },
            main: {
                files: [{
                    expand: true,
                    cwd: '<%=superTableDistPath%>',
                    src: ['*.js'],
                    dest: '<%=superTableDistPath%>',
                    ext: ".min.js"
                }]
            }
        },

        // JS文件语法校验
        jshint: {
            supertable: ['<%=resourcePath%>js/supertable/**/*.js'],
            docsjs: ['<%=resourcePath%>js/docs/**/*.js']
        },

        // copy文件
        copy: {
            supertable: {
                files: [{
                    expand: true,
                    cwd: '<%=superTableDistPath%>/',
                    src: ['**/*.js'],
                    dest: '<%=docsDistPath%>js/lib/'
                }]
            },
            docsjs: {
                files: [{
                    expand: true,
                    cwd: '<%=resourcePath%>js/lib/',
                    src: ['**/*.js'],
                    dest: '<%=docsDistPath%>js/lib/'
                }]
            },
            html: {
                files: [{
                    expand: true,
                    cwd: '<%=resourcePath%>html/',
                    src: ['**/*.html'],
                    dest: '<%=docsDistPath%>'
                }]
            }
        },

        //为html自动增加时间戳
        htmlstamp: {
            dev: {
                files: {
                    '<%=docsDistPath%>index.html': ['<%=docsDistPath%>js/**/*.js']
                }
            }
        },

        // 通过connect任务，创建一个静态服务器
        connect: {
            options: {
                port: 8000, // 服务器端口号，默认为8000
                hostname: 'localhost', // 服务器地址(可以使用主机名localhost，也能使用IP)
                base: './docs/'// 站点的根目录，物理路径(默认为Gruntfile.js所在目录，即值为".")
            },
            livereload: {
                options: {
                    middleware: function (connect, options, middlewares) {
                        /**
                         * 使用connect-livereload模块，生成一个LiveReload脚本，并通过LiveReload脚本，让页面重新加载:
                         * <script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
                         */
                        var lrSnippet = require('connect-livereload')({
                            port: grunt.config.get('watch').client.options.livereload
                        });
                        middlewares.unshift(lrSnippet);
                        return middlewares;
                    }
                }
            }
        },

        // 检测文件变更，用于开发环境
        watch: {
            // js变更时：合并js-js语法检查-修改html中链接后缀
            supertable: {
                files: ['<%=resourcePath%>js/supertable/**/*.js'],
                tasks: ['jshint:supertable', 'concat:supertable', 'uglify','copy:supertable', 'htmlstamp:dev']
            },
            // js变更时：合并js-js语法检查-修改html中链接后缀
            docsjs: {
                files: ['<%=resourcePath%>js/**/*.js'],
                tasks: ['jshint:docsjs', 'concat:docsjs', 'copy:html', 'htmlstamp:dev']
            },
            // html变更时：拷贝html-修改html中链接后缀
            html: {
                files: ['<%=resourcePath%>html/**/*.html'],
                tasks: ['copy:html', 'htmlstamp:dev']
            },
            // Gruntfile.js变更时：重新加载watch
            configFiles: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            },
            // 这里的文件变化之后，自动调用LiveReload刷新浏览器
            client: {
                options: {
                    livereload: 35729 // LiveReload的端口号，默认为35729
                },
                files: ['<%=connect.options.base || "."%>/*.html']
            }
        }
    });

    //加载各种grunt插件任务
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.loadNpmTasks('grunt-htmlstamp');

    //测试：创建服务器且免F5实时刷新页面
    grunt.registerTask('live', ['connect', 'watch']);

    // 构建开发版本，也是合入svn的版本，不压缩js和css，html中的js和css链接自动增加后缀（例如g.js?t=123），避免浏览器缓存
    grunt.registerTask('dev', ['clean', 'concat', 'jshint', 'uglify','copy', 'htmlstamp:dev']);

    // 构建开发调试版本，开发过程中使用，能够检测文件变化，并且自建了一个web服务器（默认地址localhost:8000），可以浏览器静态html页面，使用该web服务器访问时能够自动刷新浏览器页面，便于开发。
    grunt.registerTask('default', ['dev', 'live']);

};
