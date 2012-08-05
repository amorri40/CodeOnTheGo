CodeMirror.defineMode("python", function(conf, parserConf) {
    var ERRORCLASS = 'error';
    
    function wordRegexp(words) {
        return new RegExp("^((" + words.join(")|(") + "))\\b");
    }
    
    var singleOperators = new RegExp("^[\\+\\-\\*/%&|\\^~<>!,]");
    var singleDelimiters = new RegExp('^[\\(\\)\\[\\]\\{\\}@,:`=;\\.]');
    var doubleOperators = new RegExp("^((==)|(!=)|(<=)|(>=)|(<>)|(<<)|(>>)|(//)|(\\*\\*))");
    var doubleDelimiters = new RegExp("^((\\+=)|(\\-=)|(\\*=)|(%=)|(/=)|(&=)|(\\|=)|(\\^=))");
    var tripleDelimiters = new RegExp("^((//=)|(>>=)|(<<=)|(\\*\\*=))");
    var identifiers = new RegExp("^[_A-Za-z][_A-Za-z0-9]*");

    var wordOperators = wordRegexp(['and', 'or', 'not', 'is', 'in']);
    var commonkeywords = ['as', 'assert', 'break', 'class', 'continue',
                          'def', 'del', 'elif', 'else', 'except', 'finally',
                          'for', 'from', 'global', 'if', 'import',
                          'lambda', 'pass', 'raise', 'return',
                          'try', 'while', 'with', 'yield'];
    var commonBuiltins = ['abs', 'all', 'any', 'bin', 'bool', 'bytearray', 'callable', 'chr',
                          'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod',
                          'enumerate', 'eval', 'filter', 'float', 'format', 'frozenset',
                          'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex', 'id',
                          'input', 'int', 'isinstance', 'issubclass', 'iter', 'len',
                          'list', 'locals', 'map', 'max', 'memoryview', 'min', 'next',
                          'object', 'oct', 'open', 'ord', 'pow', 'property', 'range',
                          'repr', 'reversed', 'round', 'set', 'setattr', 'slice',
                          'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple',
                          'type', 'vars', 'zip', '__import__', 'NotImplemented',
                          'Ellipsis', '__debug__'];
    var py2 = {'builtins': ['apply', 'basestring', 'buffer', 'cmp', 'coerce', 'execfile',
                            'file', 'intern', 'long', 'raw_input', 'reduce', 'reload',
                            'unichr', 'unicode', 'xrange', 'False', 'True', 'None'],
               'keywords': ['exec', 'print'],
			   'modules': ['__builtin__','__future__','__main__','_winreg','abc','aepack','aetools','aetypes','aifc','al','AL','anydbm','applesingle','argparse','array','ast','asynchat','asyncore','atexit','audioop','autoGIL','base64','BaseHTTPServer','Bastion','bdb','binascii','binhex','bisect','bsddb','buildtools','bz2','calendar','Carbon\\.AE','Carbon\\.AH','Carbon\\.App','Carbon\\.Appearance','Carbon\\.CarbonEvents','Carbon\\.CarbonEvt','Carbon\\.CF','Carbon\\.CG','Carbon\\.Cm','Carbon\\.Components','Carbon\\.ControlAccessor','Carbon\\.Controls','Carbon\\.CoreFounation','Carbon\\.CoreGraphics','Carbon\\.Ctl','Carbon\\.Dialogs','Carbon\\.Dlg','Carbon\\.Drag','Carbon\\.Dragconst','Carbon\\.Events','Carbon\\.Evt','Carbon\\.File','Carbon\\.Files','Carbon\\.Fm','Carbon\\.Folder','Carbon\\.Folders','Carbon\\.Fonts','Carbon\\.Help','Carbon\\.IBCarbon','Carbon\\.IBCarbonRuntime','Carbon\\.Icns','Carbon\\.Icons','Carbon\\.Launch','Carbon\\.LaunchServices','Carbon\\.List','Carbon\\.Lists','Carbon\\.MacHelp','Carbon\\.MediaDescr','Carbon\\.Menu','Carbon\\.Menus','Carbon\\.Mlte','Carbon\\.OSA','Carbon\\.OSAconst','Carbon\\.Qd','Carbon\\.Qdoffs','Carbon\\.QDOffscreen','Carbon\\.Qt','Carbon\\.QuickDraw','Carbon\\.QuickTime','Carbon\\.Res','Carbon\\.Resources','Carbon\\.Scrap','Carbon\\.Snd','Carbon\\.Sound','Carbon\\.TE','Carbon\\.TextEdit','Carbon\\.Win','Carbon\\.Windows','cd','cfmfile','cgi','CGIHTTPServer','cgitb','chunk','cmath','cmd','code','codecs','codeop','collections','ColorPicker','colorsys','commands','compileall','compiler','compiler\\.ast','compiler\\.visitor','ConfigParser','contextlib','Cookie','cookielib','copy','copy_reg','cPickle','cProfile','crypt','cStringIO','csv','ctypes','curses','curses\\.ascii','curses\\.panel','curses\\.textpad','datetime','dbhash','dbm','decimal','DEVICE','difflib','dircache','dis','distutils','distutils\\.archive_util','distutils\\.bcppcompiler','distutils\\.ccompiler','distutils\\.cmd','distutils\\.command','distutils\\.command\\.bdist','distutils\\.command\\.bdist_dumb','distutils\\.command\\.bdist_msi','distutils\\.command\\.bdist_packager','distutils\\.command\\.bdist_rpm','distutils\\.command\\.bdist_wininst','distutils\\.command\\.build','distutils\\.command\\.build_clib','distutils\\.command\\.build_ext','distutils\\.command\\.build_py','distutils\\.command\\.build_scripts','distutils\\.command\\.check','distutils\\.command\\.clean','distutils\\.command\\.config','distutils\\.command\\.install','distutils\\.command\\.install_data','distutils\\.command\\.install_headers','distutils\\.command\\.install_lib','distutils\\.command\\.install_scripts','distutils\\.command\\.register','distutils\\.command\\.sdist','distutils\\.core','distutils\\.cygwinccompiler','distutils\\.debug','distutils\\.dep_util','distutils\\.dir_util','distutils\\.dist','distutils\\.emxccompiler','distutils\\.errors','distutils\\.extension','distutils\\.fancy_getopt','distutils\\.file_util','distutils\\.filelist','distutils\\.log','distutils\\.msvccompiler','distutils\\.spawn','distutils\\.sysconfig','distutils\\.text_file','distutils\\.unixccompiler','distutils\\.util','distutils\\.version','dl','doctest','DocXMLRPCServer','dumbdbm','dummy_thread','dummy_threading','EasyDialogs','email','email\\.charset','email\\.encoders','email\\.errors','email\\.generator','email\\.header','email\\.iterators','email\\.message','email\\.mime','email\\.parser','email\\.utils','encodings\\.idna','encodings\\.utf_8_sig','errno','exceptions','fcntl','filecmp','fileinput','findertools','FL','fl','flp','fm','fnmatch','formatter','fpectl','fpformat','fractions','FrameWork','ftplib','functools','future_builtins','gc','gdbm','gensuitemodule','getopt','getpass','gettext','gl','GL','glob','grp','gzip','hashlib','heapq','hmac','hotshot','hotshot\\.stats','htmlentitydefs','htmllib','HTMLParser','httplib','ic','icopen','imageop','imaplib','imgfile','imghdr','imp','importlib','imputil','inspect','io','itertools','jpeg','json','keyword','lib2to3','linecache','locale','logging','logging\\.config','logging\\.handlers','macerrors','MacOS','macostools','macpath','macresource','mailbox','mailcap','marshal','math','md5','mhlib','mimetools','mimetypes','MimeWriter','mimify','MiniAEFrame','mmap','modulefinder','msilib','msvcrt','multifile','multiprocessing','multiprocessing\\.connection','multiprocessing\\.dummy','multiprocessing\\.managers','multiprocessing\\.pool','multiprocessing\\.sharedctypes','mutex','Nav','netrc','new','nis','nntplib','numbers','operator','optparse','os','os\\.path','ossaudiodev','parser','pdb','pickle','pickletools','pipes','PixMapWrapper','pkgutil','platform','plistlib','popen2','poplib','posix','posixfile','pprint','profile','pstats','pty','pwd','py_compile','pyclbr','pydoc','Queue','quopri','random','re','readline','repr','resource','rexec','rfc822','rlcompleter','robotparser','runpy','sched','ScrolledText','select','sets','sgmllib','sha','shelve','shlex','shutil','signal','SimpleHTTPServer','SimpleXMLRPCServer','site','smtpd','smtplib','sndhdr','socket','SocketServer','spwd','sqlite3','ssl','stat','statvfs','string','StringIO','stringprep','struct','subprocess','sunau','sunaudiodev','SUNAUDIODEV','symbol','symtable','sys','sysconfig','syslog','tabnanny','tarfile','telnetlib','tempfile','termios','test','test\\.test_support','textwrap','thread','threading','time','timeit','Tix','Tkinter','token','tokenize','trace','traceback','ttk','tty','turtle','types','unicodedata','unittest','urllib','urllib2','urlparse','user','UserDict','UserList','UserString','uu','uuid','videoreader','warnings','wave','weakref','webbrowser','whichdb','winsound','wsgiref','wsgiref\\.handlers','wsgiref\\.headers','wsgiref\\.simple_server','wsgiref\\.util','wsgiref\\.validate','xdrlib','xml\\.dom','xml\\.dom\\.minidom','xml\\.dom\\.pulldom','xml\\.etree\\.ElementTree','xml\\.parsers\\.expat','xml\\.sax','xml\\.sax\\.handler','xml\\.sax\\.saxutils','xml\\.sax\\.xmlreader','xmlrpclib','zipfile','zipimport','zlib']
			   
			   
			   
			   
			   }; //end of py2
    var py3 = {'builtins': ['ascii', 'bytes', 'exec', 'print'],
               'keywords': ['nonlocal', 'False', 'True', 'None']};
			   
	
	/*To get modules use this Javascript on http://docs.python.org/modindex.html :
	var tbody = $('.indextable')[0].firstChild;
	var names=''; for (i=0; i<tbody.childElementCount+25;i++) { var tablerow=tbody.childNodes[i].childNodes[3]; if (tablerow!=null && tablerow.childElementCount>0) {var name_=tablerow.childNodes[1]; if(name_.text && name_.text.length>1) { names+="'"+name_.text.replace(/\./g,'\\\\.')+"',";} } } console.log(''+names);
	*/

    if (!!parserConf.version && parseInt(parserConf.version, 10) === 3) {
        commonkeywords = commonkeywords.concat(py3.keywords);
        commonBuiltins = commonBuiltins.concat(py3.builtins);
        var stringPrefixes = new RegExp("^(([rb]|(br))?('{3}|\"{3}|['\"]))", "i");
    } else {
        commonkeywords = commonkeywords.concat(py2.keywords);
        commonBuiltins = commonBuiltins.concat(py2.builtins);
        var stringPrefixes = new RegExp("^(([rub]|(ur)|(br))?('{3}|\"{3}|['\"]))", "i");
    }
    var keywords = wordRegexp(commonkeywords);
    var builtins = wordRegexp(commonBuiltins);
	var modules = wordRegexp(py2.modules);

    var indentInfo = null;

    // tokenizers
    function tokenBase(stream, state) {
        // Handle scope changes
        if (stream.sol()) {
            var scopeOffset = state.scopes[0].offset;
            if (stream.eatSpace()) {
                var lineOffset = stream.indentation();
                if (lineOffset > scopeOffset) {
                    indentInfo = 'indent';
                } else if (lineOffset < scopeOffset) {
                    indentInfo = 'dedent';
                }
                return null;
            } else {
                if (scopeOffset > 0) {
                    dedent(stream, state);
                }
            }
        }
        if (stream.eatSpace()) {
            return null;
        }
        
        var ch = stream.peek();
        
        // Handle Comments
        if (ch === '#') {
            stream.skipToEnd();
            return 'comment';
        }
        
        // Handle Number Literals
        if (stream.match(/^[0-9\.]/, false)) {
            var floatLiteral = false;
            // Floats
            if (stream.match(/^\d*\.\d+(e[\+\-]?\d+)?/i)) { floatLiteral = true; }
            if (stream.match(/^\d+\.\d*/)) { floatLiteral = true; }
            if (stream.match(/^\.\d+/)) { floatLiteral = true; }
            if (floatLiteral) {
                // Float literals may be "imaginary"
                stream.eat(/J/i);
                return 'number';
            }
            // Integers
            var intLiteral = false;
            // Hex
            if (stream.match(/^0x[0-9a-f]+/i)) { intLiteral = true; }
            // Binary
            if (stream.match(/^0b[01]+/i)) { intLiteral = true; }
            // Octal
            if (stream.match(/^0o[0-7]+/i)) { intLiteral = true; }
            // Decimal
            if (stream.match(/^[1-9]\d*(e[\+\-]?\d+)?/)) {
                // Decimal literals may be "imaginary"
                stream.eat(/J/i);
                // TODO - Can you have imaginary longs?
                intLiteral = true;
            }
            // Zero by itself with no other piece of number.
            if (stream.match(/^0(?![\dx])/i)) { intLiteral = true; }
            if (intLiteral) {
                // Integer literals may be "long"
                stream.eat(/L/i);
                return 'number';
            }
        }
        
        // Handle Strings
        if (stream.match(stringPrefixes)) {
            state.tokenize = tokenStringFactory(stream.current());
            return state.tokenize(stream, state);
        }
        
        // Handle operators and Delimiters
        if (stream.match(tripleDelimiters) || stream.match(doubleDelimiters)) {
            return 'delimiter';
        }
        if (stream.match(doubleOperators)
            || stream.match(singleOperators)
            || stream.match(wordOperators)) {
            return 'operator';
        }
        if (stream.match(singleDelimiters)) {
            return 'delimiter';
        }
        
        if (stream.match(keywords)) {
            return 'keyword';
        }
        
        if (stream.match(builtins)) {
            return 'builtin';
        }
		
		if (stream.match(modules)) {
		   return 'module';
		}
        
        if (stream.match(identifiers)) {
            return 'variable';
        }
        
        // Handle non-detected items
        stream.next();
        return ERRORCLASS;
    }
    
    function tokenStringFactory(delimiter) {
        while ('rub'.indexOf(delimiter.charAt(0).toLowerCase()) >= 0) {
            delimiter = delimiter.substr(1);
        }
        var singleline = delimiter.length == 1;
        var OUTCLASS = 'string';
        
        return function tokenString(stream, state) {
            while (!stream.eol()) {
                stream.eatWhile(/[^'"\\]/);
                if (stream.eat('\\')) {
                    stream.next();
                    if (singleline && stream.eol()) {
                        return OUTCLASS;
                    }
                } else if (stream.match(delimiter)) {
                    state.tokenize = tokenBase;
                    return OUTCLASS;
                } else {
                    stream.eat(/['"]/);
                }
            }
            if (singleline) {
                if (parserConf.singleLineStringErrors) {
                    return ERRORCLASS;
                } else {
                    state.tokenize = tokenBase;
                }
            }
            return OUTCLASS;
        };
    }
    
    function indent(stream, state, type) {
        type = type || 'py';
        var indentUnit = 0;
        if (type === 'py') {
            if (state.scopes[0].type !== 'py') {
                state.scopes[0].offset = stream.indentation();
                return;
            }
            for (var i = 0; i < state.scopes.length; ++i) {
                if (state.scopes[i].type === 'py') {
                    indentUnit = state.scopes[i].offset + conf.indentUnit;
                    break;
                }
            }
        } else {
            indentUnit = stream.column() + stream.current().length;
        }
        state.scopes.unshift({
            offset: indentUnit,
            type: type
        });
    }
    
    function dedent(stream, state, type) {
        type = type || 'py';
        if (state.scopes.length == 1) return;
        if (state.scopes[0].type === 'py') {
            var _indent = stream.indentation();
            var _indent_index = -1;
            for (var i = 0; i < state.scopes.length; ++i) {
                if (_indent === state.scopes[i].offset) {
                    _indent_index = i;
                    break;
                }
            }
            if (_indent_index === -1) {
                return true;
            }
            while (state.scopes[0].offset !== _indent) {
                state.scopes.shift();
            }
            return false
        } else {
            if (type === 'py') {
                state.scopes[0].offset = stream.indentation();
                return false;
            } else {
                if (state.scopes[0].type != type) {
                    return true;
                }
                state.scopes.shift();
                return false;
            }
        }
    }

    function tokenLexer(stream, state) {
        indentInfo = null;
        var style = state.tokenize(stream, state);
        var current = stream.current();

        // Handle '.' connected identifiers
        if (current === '.') {
            style = stream.match(identifiers, false) ? null : ERRORCLASS;
            if (style === null && state.lastToken === 'meta') {
                // Apply 'meta' style to '.' connected identifiers when
                // appropriate.
                style = 'meta';
            }
            return style;
        }
        
        // Handle decorators
        if (current === '@') {
            return stream.match(identifiers, false) ? 'meta' : ERRORCLASS;
        }

        if ((style === 'variable' || style === 'builtin')
            && state.lastToken === 'meta') {
            style = 'meta';
        }
        
        // Handle scope changes.
        if (current === 'pass' || current === 'return') {
            state.dedent += 1;
        }
        if (current === 'lambda') state.lambda = true;
        if ((current === ':' && !state.lambda && state.scopes[0].type == 'py')
            || indentInfo === 'indent') {
            indent(stream, state);
        }
        var delimiter_index = '[({'.indexOf(current);
        if (delimiter_index !== -1) {
            indent(stream, state, '])}'.slice(delimiter_index, delimiter_index+1));
        }
        if (indentInfo === 'dedent') {
            if (dedent(stream, state)) {
                return ERRORCLASS;
            }
        }
        delimiter_index = '])}'.indexOf(current);
        if (delimiter_index !== -1) {
            if (dedent(stream, state, current)) {
                return ERRORCLASS;
            }
        }
        if (state.dedent > 0 && stream.eol() && state.scopes[0].type == 'py') {
            if (state.scopes.length > 1) state.scopes.shift();
            state.dedent -= 1;
        }
        
        return style;
    }

    var external = {
        startState: function(basecolumn) {
            return {
              tokenize: tokenBase,
              scopes: [{offset:basecolumn || 0, type:'py'}],
              lastToken: null,
              lambda: false,
              dedent: 0
          };
        },
        
        token: function(stream, state) {
            var style = tokenLexer(stream, state);
            
            state.lastToken = style;
            
            if (stream.eol() && stream.lambda) {
                state.lambda = false;
            }
            
            return style;
        },
        
        indent: function(state, textAfter) {
            if (state.tokenize != tokenBase) {
                return 0;
            }
            
            return state.scopes[0].offset;
        }
        
    };
    return external;
});

CodeMirror.defineMIME("text/x-python", "python");
