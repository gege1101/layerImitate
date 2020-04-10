;!(function(window){
    var doc = document,
        query = "querySelectorAll",
        claname = "getElementsByClassName",
        S = function(selector){
           return  doc[query](selector)
        }
        config = {
            type:0,
            anim:"scale",
            shade:true,
            shadeClose:true,
        }

    var ready={
        extend:function(options){
            var newObj = JSON.parse(JSON.stringify(config));
            for(var k in options){
                newObj[k] = options[k]
            }
            return newObj;
        },
        timer:{},  //收集自动关闭定时器
        end:{}     //收集结束回调函数
    };

    ready.touch = function(elem,fn){
        elem.addEventListener('click',function(e){
            fn.call(this,e)
        })
    }

    var index = 0;
    classes = ['lcui-m-layer'];
    var Layer= function(options){
        var that = this;
        that.config = ready.extend(options);
        that.view()
    };

    Layer.prototype.view = function(){
        var that = this,
        config = that.config,
        layerbox = doc.createElement('div');

        that.index = index ;
        
        that.id = layerbox.id = classes[0]+index;

        layerbox.setAttribute('class',classes[0] + " " +classes[0]+config.type);

        layerbox.setAttribute('index',index) ;
        
        //头
        var title = (function(){
            if(!config.title) return "";

            var tpl ='';
            var isTitleObj = typeof config.title === 'object';
            if(isTitleObj){
               tpl =`<div class='lcui-m-layertitle' style='${config.title[1]}'>${config.title[0]}</div>` 
            }else{
                tpl = `<div class='lcui-m-layertitle'>${config.title}</div>` 
            }
            return tpl;

        }())

        //按钮
        var btns = (function(){
            if(!config.btn) return '';
            var tpl ='',btnlen;
            
            typeof config.btn ==='string' && (config.btn = [config.btn]);
            btnlen = config.btn.length;
            if(btnlen == 1){
                tpl = `
                <div class='lcui-m-layerbtn'>
                    <span yes type='1'>${config.btn[0]}</span>
                </div> 
            `
            }else if(btnlen == 2){
                tpl = `
                <div class='lcui-m-layerbtn'>
                    <span no type='0'>${config.btn[1]}</span>
                    <span yes type='1'>${config.btn[0]}</span>
                </div> 
            `
            }
            return tpl;
        }())
  

        if(config.skin) config.anim = 'up';
        if(config.skin === 'msg') config.shade = false;

        var shade = (function(){
            if(!config.shade) return '';
            return "<div class='lcui-m-layershade'></div>";
        }())

        var layerboxinnerTpl = `
        ${shade}
        <div class='lcui-m-layermain'>
            <div class='lcui-m-layersection'>
                <div class='lcui-m-layerchild ${config.anim?("lcui-m-anim-"+config.anim):''} ${config.skin?("lcui-m-layer-"+config.skin):""}'
                  style ='${config.style?config.style:""}'
                >
                    ${title}
                     <div class='lcui-m-layercont'>${config.content}</div>
                    ${btns} 
                </div>
            </div>
        </div>`
        layerbox.innerHTML = layerboxinnerTpl;

        document.body.appendChild(layerbox);

        var elem =  that.elem = S("#"+that.id)[0];
        config.sucess&&config.sucess(elem)

        that.index = index++
        that.action(config,elem)
    }

    Layer.prototype.action = function(config,elem){
        var that = this;

        //自动关闭
        if(config.time){
           ready.timer[that.index] = setTimeout(function(){
                layer.close(that.index)
            },config.time*1000)
        }

        //确认取消
        var btnfn = function(){
            var type = this.getAttribute('type');

            if(type == 0){
                config.no && config.no();
                layer.close(that.inex)
            }
            if(type == 1){
                if(config.yes){
                    config.yes(that.index)
                }else{
                    layer.close(that.index)
                }
            }
        };
        if(config.btn){
            var btns = elem[claname]('lcui-m-layerbtn')[0].children;
            var btnLen = btns.length;
            for(var i=0 ; i<btnLen ;i++){
                ready.touch(btns[i],btnfn)
            }
        }

        //点击遮罩层
        if(config.shade && config.shadeClose){
            var shade = elem[claname]("lcui-m-layershade")[0];
            ready.touch(shade,function(){
                layer.close(that.index,config.end);
            })
        }
        config.end && (ready.end[that.index] = config.end)
    }


    window.layer = {
        v:'1.0',
        index:index,
        open:function(options){
            var o = new Layer(options||{})
            return o.index
        },
        close:function (index){
            var ibox= S("#"+classes[0]+index)[0];
            if(!ibox) return ;
            ibox.innerHTML = '';
            doc.body.removeChild(ibox);
            clearTimeout(ready.timer[index]);
            delete ready.timer[index];
            typeof ready.end[index] === 'function'&& ready.end[index]();
            delete ready.end[index];
        },
        closeAll :function(){
            var boxs = doc[claname](classes[0]);
            for(var i=0;i<boxs.length;i++){
                layer.close(box[0].getAttribute('index')|0)
            }
        }
    };

    //插入css样式
    var link = doc.createElement('link');
    link.href = "./need/layerlc.css";
    link.type = 'text/css';
    link.rel = 'styleSheet';
    link.id = 'layermcss';

    document.head.appendChild(link);

})(window)