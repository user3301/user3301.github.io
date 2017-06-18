---
layout: post
title: "SQL模糊查询算法优化"
date: 2017-06-18
excerpt: "An optimized algorithm for sql fuzzy query."
tags: [Java, SQL]
comments: true
---

之前在做一个`Swing`界面的点餐系统时候看到一个教程中关于使用`EJB`框架在`dao`层模糊查询的一个实现，之前在学习模糊匹配查询时代码是：

```
public List<Customer> query(Customer criteria) {
		StringBuilder sql = new StringBuilder("SELECT * FROM t_customer WHERE 1=1");
		List<Object> params = new ArrayList<Object>();
		if(criteria.getCname()!=null&&!criteria.getCname().trim().isEmpty()) {
			sql.append("AND cname LIKE?");
			params.add("%"+criteria.getCname()+"%");  //允许模糊查询
		}
		if(criteria.getGender()!=null&&!criteria.getGender().trim().isEmpty()) {
			sql.append("AND gender=?");
			params.add(criteria.getGender());
		}
		if(criteria.getBirthday()!=null&&!criteria.getBirthday().trim().isEmpty()) {
			sql.append("AND birthday=?");
			params.add(criteria.getBirthday());
		}
		if(criteria.getCellphone()!=null&&!criteria.getCellphone().trim().isEmpty()) {
			sql.append("AND cellphone=?");
			params.add(criteria.getCellphone());
		}
		if(criteria.getEmail()!=null&&!criteria.getEmail().trim().isEmpty()) {
			sql.append("AND email=?");
			params.add(criteria.getEmail());
		}
		try {
			return qr.query(sql.toString(),new BeanListHandler<Customer>(Customer.class),params.toArray());
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}
```

上述代码实现了向持久层中传输`sql`语句来查找并调出所有符合条件的对象，其中`sql`语句使用`StringBuilder`来存一条`SELECT * FROM t_customer WHERE 1=1`，其中`1=1`是为了在之后添加条件，因为之后添加的条件要做判断，添加的`sql`语句格式为`AND ${property} like ? % criteria.property&`， 其正规的多条件查询的`sql`语句为：

```
SELECT * FROM t_database_table WHERE t_attr1 LIKE %+our criteria+% AND t_attr2 LIKE ......
```

之所以在第一个条件中写入`WHERE 1=1`这看似没有意义的条件是因为我们不知道用户传入哪些条件，也就是说我们不知道哪条判断后要加`AND`,加入没有`WHERE 1=1`这条的话，当判断第一个criteria成功时我们append到sql语句中的是`AND criteria LIKE %our criteria%`,这样sql语句就变成了：

```
SELECT * FROM t_customer WHERE AND criter LIKE %our criteria%
```

很显然这是一条错误的sql语句，所以`1=1`就是为了之后我们任何一条条件都可以以`AND`作为开头append到sql中。
## BUT
在通过做`Swing`项目中看到了其他的大神写的代码后这个问题得到了更好的实现,先上代码：

```
public List<Customer> query(Customer criteria) {
		StringBuilder sql = new StringBuilder("SELECT * FROM t_customer");
		List<Object> params = new ArrayList<Object>();
		if(criteria.getCname()!=null&&!criteria.getCname().trim().isEmpty()) {
			sql.append("AND cname LIKE?");
			params.add("%"+criteria.getCname()+"%");  //允许模糊查询
		}
		if(criteria.getGender()!=null&&!criteria.getGender().trim().isEmpty()) {
			sql.append("AND gender=?");
			params.add(criteria.getGender());
		}
		if(criteria.getBirthday()!=null&&!criteria.getBirthday().trim().isEmpty()) {
			sql.append("AND birthday=?");
			params.add(criteria.getBirthday());
		}
		if(criteria.getCellphone()!=null&&!criteria.getCellphone().trim().isEmpty()) {
			sql.append("AND cellphone=?");
			params.add(criteria.getCellphone());
		}
		if(criteria.getEmail()!=null&&!criteria.getEmail().trim().isEmpty()) {
			sql.append("AND email=?");
			params.add(criteria.getEmail());
		}
		try {
			return qr.query(sql.toString().replaceFirst("AND,"WHERE"),new BeanListHandler<Customer>(Customer.class),params.toArray());
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}

```

这个做法的精髓之处就在于最后执行`SQL`语句的时候：

```
qr.query(sql.toString().replaceFirst("AND,"WHERE")
```

其算法是之前每次append到sql中的都是`AND`开头，最后执行时将第一个`AND`改为`WHERE`,这样做的好处是当查询的数据库条目巨大时能够提高效率，以为我们知道当sql语句执行的时候`WHERE`后面的条件会按照顺序一一执行，那么当`1=1`执行就会扫描挣个查找的表，但是第二种做法就不会扫描全表从而提升效率。

### 备注
`String`,`StringBuilder`和`StringBuffer`的区别：</br>

StringBuilder与 StringBuffer

　　　　StringBuilder：线程非安全的

　　　　StringBuffer：线程安全的

　　　　当我们在字符串缓冲去被多个线程使用是，JVM不能保证StringBuilder的操作是安全的，虽然他的速度最快，但是可以保证StringBuffer是可以正确操作的。当然大多数情况下就是我们是在单线程下进行的操作，所以大多数情况下是建议用StringBuilder而不用StringBuffer的，就是速度的原因。

1.如果要操作少量的数据用 = String </br>
2.单线程操作字符串缓冲区 下操作大量数据 = StringBuilder</br>
3.多线程操作字符串缓冲区 下操作大量数据 = StringBuffer</br>
