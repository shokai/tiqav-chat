String.prototype.markup = function(){
    return this.escape_html().split(/(\s+)/).map(function(i){
        if(i.match(/^\s+$/)) return i;
        if(i.match(/^https?\:\/\/[^\s]+\.(jpe?g|gif|png)$/)){
            return i.replace(/^(https?\:\/\/[^\s]+)\.(jpe?g|gif|png)$/g, '<img src="$1.$2">');
        }
        return i.replace(/^(https?\:\/\/[^\s]+)$/g, '<a href="$1">$1</a>');
    }).join('');
};

String.prototype.escape_html = function(){
    var span = document.createElement('span');
    var txt =  document.createTextNode('');
    span.appendChild(txt);
    txt.data = this;
    return span.innerHTML;
};
