#example
本页面是supertable.js的演示。

##注意
演示页面使用了百度UEditor，因此请首先到[http://ueditor.baidu.com/website/download.html](http://ueditor.baidu.com/website/download.html)下载一个1.4.3.1PHP版本（当然其他版本理论上也是OK的，只是我写这个页面时用的就是这个版本），解压后，将其中的文件拷贝的ueditor中，使得docs/ueditor/index.html可访问。

##测试
一切准备好之后，F12打开控制台，点击【插入测试数据】，此时页面就出现了测试用的table，然后分别点击【TEST getDataArray】和【TEST getDataMap】,留意控制台的输出和下页面下方textarea框内的结果。

##更多可能性
请在excel中复制一段数据，然后粘贴到这个页面的编辑器中（不要在源代码模式下粘贴），此时可以看到编辑器中出现了复制了的表格，再点击【TEST getDataArray】和【TEST getDataMap】，看到了什么？

没错！！很多时候我们处理一些数据时使用excel来做，但假如要再对数据进行更多自定义的处理时，如何将其中的数据转换成json格式的数据呢？只要拿到了json格式的数据，对于程序员而言，接下来的一切都简单了，别告诉我说你不会遍历...

