# node-api-server

## start
```
npm start
```
## example 

* 注册服务

```
uri: /register
method: POST
Content-Type: application/json

http body:
{
	"service":"data-service"
}
```
返回：

```
ok
```
* 查看服务

```
uri: /data-service/test/hello
method: GET
```
返回：

```
hello world
```

