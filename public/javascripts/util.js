String.prototype.markup = function(){
    var s = this.escape_html();
    s = s.replace(/(https?\:\/\/[^\s]+)/g, '<a href="$1">$1</a>');
    return s;
};

String.prototype.escape_html = function(){
    var span = document.createElement('span');
    var txt =  document.createTextNode('');
    span.appendChild(txt);
    txt.data = this;
    return span.innerHTML;
};
