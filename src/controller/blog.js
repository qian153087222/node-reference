const { exec,escape } = require('../db/mysql');
const xss = require('xss');

//获取博客列表
const getList = (author, keyword) => {
    // 1=1 兼容可能author和keyword可能为空的情况
    let sql = `select * from blogs where 1=1 and state=${1}`;

    //根据作者查询 and 类似& where类似?
    if (author) {
        author = escape(author);
        sql += `and author='${author}'`;
    }

    //模糊查询 title
    if (keyword) {
        keyword = escape(keyword);
        sql += `and title like '%${keyword}%' `;
    }

    //时间倒序
    sql += ` order by createtime desc;`

    return exec(sql);
}

//获取博客详情
const getDetail = async (id) => {
    id = escape(id);
    //在所有数组中查询id为id的数据
    const sql = `select * from blogs where id='${id}'`;
    const [result] = await exec(sql);
    return result;
}
//新建blogs
const newBlog = async (blogData = {}) => {
    // blogData 是一个博客对象，包含 title content author 属性
    const { title, content, author, createTime = Date.now() } = blogData;
    // insert 为blogs表添加博客详情  blogs () values ()
    title = escape(xss(title));
    content = escape(xss(content));
    author = escape(author);
    const sql = `
        insert into blogs (title, content, createtime, author,state)
        values ('${title}', '${content}', ${createTime}, '${author}',1);
    `;
    const { insertId: id } = await exec(sql);
    // OkPacket {
    //     fieldCount: 0,
    //     affectedRows: 1,//影响的行数
    //     insertId: 1, //插入的id
    //     serverStatus: 2,
    //     warningCount: 0,
    //     message: '',
    //     protocol41: true,
    //     changedRows: 0
    //   }
    return { id };
}

//更新blogs
const updateBlog = async (id, blogData = {}) => {
    // blogData 是一个博客对象，包含 title content 属性

    const { title, content } = blogData;
    title = escape(xss(title));
    content = escape(xss(content));
    //更新数据
    const sql = `
        update blogs set title='${title}', content='${content}' where id=${id}
    `;

    const { changedRows, affectedRows } = await exec(sql);
    //     fieldCount: 0,
    //   affectedRows: 1,
    //   insertId: 0,
    //   serverStatus: 2,
    //   warningCount: 0,
    //   message: '(Rows matched: 1  Changed: 1  Warnings: 0',
    //   protocol41: true,
    //   changedRows: 1 //改变的行数
    return changedRows > 0 && affectedRows > 0 ? true : false;
}

//删除blogs
const delBlog = async(id, author) => {
    // blogData 是一个博客对象，包含 title content 属性
    //彻底删除 `delete from blogs where id='${id}' and author='${author}`
    id = escape(id);
    author = escape(author);
    const sql = `
    update blogs set state='${0}' where id=${id} and author='${author}'
`;
    //更新数据
    const { changedRows, affectedRows,serverStatus } =  await exec(sql);
    console.log( serverStatus)
    return changedRows > 0 && affectedRows > 0 ? true : false;
}

module.exports = { getList, getDetail, newBlog, updateBlog, delBlog }