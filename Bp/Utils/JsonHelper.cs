using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Newtonsoft.Json;
using System.Web.Script.Serialization;
using PagedList;

namespace Bp.Utils
{
    public class JsonHelper
    {
        /// <summary>
        /// json格式转换
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="strJson"></param>
        /// <returns></returns>
        public static T FromJson<T>(string strJson) where T : class
        {
            if (string.IsNullOrEmpty(strJson)) return null;
            return JsonConvert.DeserializeObject<T>(strJson);
            //return new JavaScriptSerializer().Deserialize<T>(strJson);
        }
        /// <summary>
        /// 类对像转换成json格式
        /// </summary> 
        /// <returns></returns>
        public static string ToJson(object t)
        {
            JsonSerializerSettings microsoftDateFormatSettings = new JsonSerializerSettings
            {
                DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
            };
            return JsonConvert.SerializeObject(t, microsoftDateFormatSettings);
            //return new JavaScriptSerializer().Serialize(t);
        }

        /// <summary>
        /// 类对像转换成json格式,可去掉指定字段
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="removeproperties">需要不转成Json的字段</param>
        /// <returns></returns>
        public static string ToJson<T>(T t,string[] removeproperties)
        {
            var data = ObjectToHash<T>(t, removeproperties);
            return new JavaScriptSerializer().Serialize(data);
        }

        /// <summary>
        /// IEnum对像转换成json格式,主要用于linq查询结果中包含自引用的情况，可去除自引用
        /// </summary> 
        /// <returns></returns>
        public static string ToJsonAndRemoveSefRef<T>(IEnumerable<T> data)
        {
            var list = IEnumToHash<T>(data);
            return ToJson(list);
        }

        /// <summary>
        /// 获取LigerGrid数据源格式Json
        /// </summary>
        /// <param name="data">Linq查询数据</param>
        /// <returns></returns>
        public static string GetGridJSON<T>(IEnumerable<T> data)
        {
            string json = ToJsonAndRemoveSefRef(data);
            json = @"{""rows"":" + json + "}";
            return json;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <returns></returns>
        public static string GetGridJSON<T>(PagedList<T> data)
        {
            if (data == null)
                return @"{""Total"":""0"",""Rows"":""""}";
            string json = @"{""total"":""" + data.TotalItemCount + @""",""rows"":" + ToJson(data) + @"}";
            return json;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <returns></returns>
        public static string GetGridJSON(IEnumerable data)
        {
            if (data == null)
                return @"{""Rows"":"""",""Total"":""0""}";
            string json = ToJson(data);
            json = @"{""Rows"":" + json + "}";
            return json;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <returns></returns>
        public static string GetGridJSON(DataSet data)
        {
            if (data == null)
                return @"{""Rows"":"""",""Total"":""0""}";
            if (data.Tables.Count == 0)
                return @"{""Rows"":"""",""Total"":""0""}";
            string json = ToJson(data.Tables[0]);
            json = @"{""Rows"":" + json + "}";
            return json;
        }

        /// <summary>
        /// 获取树形Grid JSON
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <param name="idfield"></param>
        /// <param name="pidfield"></param>
        /// <returns></returns>
        public static string GetTreeGridJSON<T>(IEnumerable<T> data, string idfield, string pidfield)
        {
            if (data == null)
                return null;
            string json = ToJson(ArrayToTreeData(IEnumToHash<T>(data), idfield, pidfield));
            json = @"{""Rows"":" + json + "}";
            return json;
        }


        /// <summary>
        /// 获取树格式对象的JSON
        /// </summary>
        /// <param name="list">List数据</param>
        /// <param name="id">ID的字段名</param>
        /// <param name="pid">PID的字段名</param>
        /// <returns></returns>
        public static string GetTreeJSON(IList<Hashtable> list, string id, string pid)
        {
            var o = ArrayToTreeData(list, id, pid);
            return ToJson(o);
        }

        /// <summary>
        /// 获取树格式对象的JSON（匿名查询结果）
        /// </summary>
        /// <param name="list">IEnum线性数据</param>
        /// <param name="id">ID的字段名</param>
        /// <param name="pid">PID的字段名</param>
        /// <returns></returns>
        public static string GetTreeJSON(IEnumerable data, string id, string pid)
        {
            if (data == null)
                return null;
            var list = IEnumToHash(data);
            var o = ArrayToTreeData(list, id, pid);
            return ToJson(o);
        }

        /// <summary>
        /// 获取树格式对象的JSON（linq查询结果）
        /// </summary>
        /// <param name="list">IEnum线性数据</param>
        /// <param name="id">ID的字段名</param>
        /// <param name="pid">PID的字段名</param>
        /// <returns></returns>
        public static string GetTreeJSON<T>(IEnumerable<T> data, string id, string pid)
        {
            if (data == null)
                return null;
            var list = IEnumToHash<T>(data);
            var o = ArrayToTreeData(list, id, pid);
            return ToJson(o);
        }

        /// <summary>
        /// 获取树格式对象的JSON，并指定根节点数据,绑定至LigerTree
        /// </summary>
        /// <param name="list">线性数据</param>
        /// <param name="id">ID的字段名</param>
        /// <param name="pid">PID的字段名</param>
        /// <param name="textfield">text字段名</param>
        /// <param name="iconfield">icon字段名</param>
        /// <param name="root">自定义根节点名称</param>
        /// <param name="rooticon">自定义根节点图标</param>
        /// <returns></returns>
        public static string GetTreeJSON<T>(IEnumerable<T> data, string id, string pid, string textfield, string iconfield, string iconroot, string root, string rooticon)
        {
            if (data == null)
                return null;
            var list = IEnumToTreeHash<T>(data, textfield, iconfield, id, iconroot);
            var o = ArrayToTreeData(list, id, pid);
            string json = ToJson(o);
            if (!string.IsNullOrEmpty(root))
            {
                json = @"[{""text"":""" + root + @""",""children"":" + json;
                if (string.IsNullOrEmpty(rooticon)) json += @",""icon"":""" + rooticon + @"""";
                json += "}]";
            }
            return json;
        }

        /// <summary>
        /// 获取树格式对象的JSON,绑定至LigerTree
        /// </summary>
        /// <param name="list">线性数据</param>
        /// <param name="id">ID的字段名</param>
        /// <param name="pid">PID的字段名</param>
        /// <param name="textfield">text字段名</param>
        /// <param name="iconfield">icon字段名</param>
        /// <returns></returns>
        public static string GetTreeJSON<T>(IEnumerable<T> data, string id, string pid, string textfield, string iconfield, string iconroot)
        {
            if (data == null)
                return null;
            var list = IEnumToTreeHash<T>(data, textfield, iconfield, id, iconroot);
            var o = ArrayToTreeData(list, id, pid);
            string json = ToJson(o);
            return json;
        }

        /// <summary>
        /// 获取LigerUI选择框格式JSON数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <param name="idfield">id字段名称</param>
        /// <param name="textfield">text字段名称</param>
        /// <returns></returns>
        public static string GetSelectJSON<T>(IEnumerable<T> data, string idfield, string textfield)
        {
            if (data == null)
                return null;
            var list = IEnumToComboBoxHash<T>(data, textfield, idfield);
            return ToJson(list);
        }

        /// <summary>
        /// 获取LigerUI选择框格式JSON数据
        /// </summary>
        /// <param name="data"></param>
        /// <param name="idfield">id字段名称</param>
        /// <param name="textfield">text字段名称</param>
        /// <returns></returns>
        public static string GetSelectJSONSimple(IList data, string idfield, string textfield)
        {
            if (data == null)
                return null;
            var list = IEnumToComboBoxHash(data, textfield, idfield);
            return ToJson(list);
        }

        /// <summary>
        /// 获取LigerUI树形选择框格式JSON数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <param name="idfield">id字段名称</param>
        /// <param name="textfield">text字段名称</param>
        /// <returns></returns>
        public static string GetTreeSelectJSON<T>(IEnumerable<T> data, string idfield, string pid, string textfield)
        {
            if (data == null)
                return null;
            var list = IEnumToComboBoxHash<T>(data, textfield, idfield);
            var o = ArrayToTreeData(list, "id", pid);
            return ToJson(o);
        }

        /// <summary>
        /// 获取LigerUI树形选择框格式JSON数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <param name="idfield">id字段名称</param>
        /// <param name="textfield">text字段名称</param>
        /// <returns></returns>
        public static string GetTreeSelectJSON(IEnumerable data, string idfield, string pid)
        {
            if (data == null)
                return null;
            var hash = IEnumToHash(data);
            var tree = ArrayToTreeData(hash, idfield, pid);
            return ToJson(tree);
        }

        /// <summary>
        /// 将IList转化为树格式对象
        /// </summary>
        /// <param name="list">线性数据</param>
        /// <param name="id">ID的字段名</param>
        /// <param name="pid">PID的字段名</param>
        /// <returns></returns>
        public static object ArrayToTreeData(IList<Hashtable> list, string id, string pid)
        {
            var h = new Hashtable(); //数据索引 
            var r = new List<Hashtable>(); //数据池,要返回的 
            foreach (var item in list)
            {
                if (!item.ContainsKey(id)) continue;
                h[item[id].ToString()] = item;
            }
            foreach (var item in list)
            {
                if (!item.ContainsKey(id)) continue;
                //如果item不包含PID字段或PID字段为null 或 则判断为父节点
                if (!item.ContainsKey(pid) || item[pid] == null )
                {
                    r.Add(item);
                }
                else
                {
                    //PID对应的节点在数据集合中找不到 则不添加此节点至树
                    if(!h.ContainsKey(item[pid].ToString())) continue;
                    var pitem = h[item[pid].ToString()] as Hashtable;
                    if (!pitem.ContainsKey("children"))
                        pitem["children"] = new List<Hashtable>();
                    var children = pitem["children"] as List<Hashtable>;
                    children.Add(item);
                }
            }
            return r;
        }

        /// <summary>
        /// 将IEnumable转换为Hashtable列表，可以去除自引用防止包含自引用无法序列化bug
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="list"></param>
        /// <param name="id"></param>
        /// <param name="pid"></param>
        /// <returns></returns>
        public static object ArrayToTreeData<T>(IEnumerable<T> list, string id, string pid)
        {
            return ArrayToTreeData(IEnumToHash<T>(list), id, pid);
        }

        /// <summary>
        /// 将IEnumable转换为LigerTree数据源结构Hashtable列表，可以去除自引用防止包含自引用无法序列化bug
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="list"></param>
        /// <param name="id"></param>
        /// <param name="pid"></param>
        /// <param name="textfield"></param>
        /// <param name="iconfield"></param>
        /// <param name="idfield"></param>
        /// <returns></returns>
        public static object ArrayToTreeData<T>(IEnumerable<T> list, string id, string pid, string textfield, string iconroot, string iconfield, string idfield)
        {
            return ArrayToTreeData(IEnumToTreeHash<T>(list, textfield, iconfield, idfield, iconroot), id, pid);
        }

        /// <summary>
        /// 将db reader转换为Hashtable列表
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private static List<Hashtable> DbReaderToHash(IDataReader reader)
        {
            var list = new List<Hashtable>();
            while (reader.Read())
            {
                var item = new Hashtable();

                for (var i = 0; i < reader.FieldCount; i++)
                {
                    var name = reader.GetName(i);
                    var value = reader[i];
                    item[name] = value;
                }
                list.Add(item);
            }
            return list;
        }

        /// <summary>
        /// 将IEnumable<T>转换为Hashtable列表，可以去除自引用防止包含自引用无法序列化bug
        /// </summary>
        /// <param name="data">泛型返回结果集</param>
        /// <returns></returns>
        private static List<Hashtable> IEnumToHash<T>(IEnumerable<T> data)
        {
            var list = new List<Hashtable>();

            Type t = typeof(T);
            System.Reflection.PropertyInfo[] ps = t.GetProperties();

            foreach (var item in data)
            {
                var ht = new Hashtable();
                foreach (System.Reflection.PropertyInfo p in ps)
                {
                    //树形数据格式消除自引用,否则无法序列化
                    if (p.PropertyType == typeof(ICollection<T>) || p.PropertyType == t)
                    {
                        continue;
                    }
                    var key = p.Name;
                    var value = p.GetValue(item, null);
                    ht[key] = value;
                }
                list.Add(ht);
            }

            return list;
        }

        /// <summary>
        /// 将IEnumable<T>转换为Hashtable列表，可去除指定属性
        /// </summary>
        /// <param name="data">泛型返回结果集</param>
        /// <returns></returns>
        private static List<Hashtable> IEnumToHash<T>(IEnumerable<T> data, string[] removeproperties)
        {
            var list = new List<Hashtable>();

            Type t = typeof(T);
            System.Reflection.PropertyInfo[] ps = t.GetProperties();

            foreach (var item in data)
            {
                var ht = new Hashtable();
                foreach (System.Reflection.PropertyInfo p in ps)
                {
                    //去除要消除的属性
                    if (removeproperties.Contains(p.Name))
                    {
                        continue;
                    }
                    var key = p.Name;
                    var value = p.GetValue(item, null);
                    ht[key] = value;
                }
                list.Add(ht);
            }

            return list;
        }

        /// <summary>
        /// T转换为Hashtable列表，可去除指定属性
        /// </summary>
        /// <param name="data">泛型返回结果集</param>
        /// <returns></returns>
        public static Hashtable ObjectToHash<T>(T data, string[] removeproperties)
        {
            var ht = new Hashtable();
            Type t = typeof(T);
            System.Reflection.PropertyInfo[] ps = t.GetProperties();

            foreach (System.Reflection.PropertyInfo p in ps)
            {
                //去除要消除的属性
                if (removeproperties.Contains(p.Name))
                {
                    continue;
                }
                var key = p.Name;
                var value = p.GetValue(data, null);
                ht[key] = value;
            }
            
            return ht;
        }

        /// <summary>
        /// 将匿名IEnumable转换为Hashtable列表
        /// </summary>
        /// <param name="data">匿名返回结果集</param>
        /// <returns></returns>
        private static List<Hashtable> IEnumToHash(IEnumerable data)
        {
            var list = new List<Hashtable>();
            foreach (var item in data)
            {
                var ht = new Hashtable();
                Type t = item.GetType();
                System.Reflection.PropertyInfo[] ps = t.GetProperties();
                foreach (System.Reflection.PropertyInfo p in ps)
                {
                    var key = p.Name;
                    var value = p.GetValue(item, null);
                    ht[key] = value;
                }
                list.Add(ht);
            }

            return list;
        }

        /// <summary>
        /// 将IEnumable转换为LigerComboBox数据源结构Hashtable列表，可以去除自引用防止包含自引用无法序列化bug
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data">数据</param>
        /// <param name="textfield">text字段名称</param>
        /// <param name="idfield">id字段名称</param>
        /// <returns></returns>
        private static List<Hashtable> IEnumToComboBoxHash<T>(IEnumerable<T> data, string textfield,string idfield)
        {
            var list = new List<Hashtable>();

            Type t = typeof(T);
            System.Reflection.PropertyInfo[] ps = t.GetProperties();

            foreach (var item in data)
            {
                var ht = new Hashtable();
                foreach (System.Reflection.PropertyInfo p in ps)
                {
                    //树形数据格式消除自引用,否则无法序列化
                    if (p.PropertyType == typeof(ICollection<T>) || p.PropertyType == t)
                    {
                        continue;
                    }
                    var key = p.Name;
                    var value = p.GetValue(item, null);
                    if (p.Name == textfield)
                    {
                        if (!ht.ContainsKey("text"))
                        {
                            ht["text"] = value;
                        }
                    }
                    if (p.Name == idfield)
                    {
                        if (!ht.ContainsKey("id"))
                        {
                            ht["id"] = value;
                        }
                    }
                    if (p.Name == idfield)
                    {
                        ht[key] = value;
                        if (!ht.ContainsKey("value"))
                        {
                            ht["value"] = value;
                        }
                    }
                    else
                    {
                        ht[key] = value;
                    }

                }
                list.Add(ht);
            }

            return list;
        }

        /// <summary>
        /// 将IEnumable转换为LigerComboBox数据源结构Hashtable列表，可以去除自引用防止包含自引用无法序列化bug
        /// </summary>
        /// <param name="data">数据</param>
        /// <param name="textfield">text字段名称</param>
        /// <param name="idfield">id字段名称</param>
        /// <returns></returns>
        private static List<Hashtable> IEnumToComboBoxHash(IList data, string textfield, string idfield)
        {
            var list = new List<Hashtable>();

            Type t = data[0].GetType();
            System.Reflection.PropertyInfo[] ps = t.GetProperties();

            foreach (var item in data)
            {
                var ht = new Hashtable();
                foreach (System.Reflection.PropertyInfo p in ps)
                {
                    var key = p.Name;
                    var value = p.GetValue(item, null);
                    if (p.Name == textfield)
                    {
                        if (!ht.ContainsKey("text"))
                        {
                            ht["text"] = value;
                        }
                    }
                    if (p.Name == idfield)
                    {
                        if (!ht.ContainsKey("id"))
                        {
                            ht["id"] = value;
                        }
                    }
                    if (p.Name == idfield)
                    {
                        ht[key] = value;
                        if (!ht.ContainsKey("value"))
                        {
                            ht["value"] = value;
                        }
                    }
                    else
                    {
                        ht[key] = value;
                    }

                }
                list.Add(ht);
            }

            return list;
        }


        /// <summary>
        /// 将IEnumable转换为LigerTree数据源结构Hashtable列表，可以去除自引用防止包含自引用无法序列化bug
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <param name="textfield"></param>
        /// <param name="iconfield"></param>
        /// <param name="idfield"></param>
        /// <param name="iconroot">图标路径前缀</param>
        /// <returns></returns>
        private static List<Hashtable> IEnumToTreeHash<T>(IEnumerable<T> data, string textfield, string iconfield, string idfield, string iconroot)
        {
            var list = new List<Hashtable>();

            Type t = typeof(T);
            System.Reflection.PropertyInfo[] ps = t.GetProperties();

            foreach (var item in data)
            {
                var ht = new Hashtable();
                foreach (System.Reflection.PropertyInfo p in ps)
                {
                    //树形数据格式消除自引用,否则无法序列化
                    if (p.PropertyType == typeof(ICollection<T>) || p.PropertyType == t)
                    {
                        continue;
                    }
                    var key = p.Name;
                    var value = p.GetValue(item, null);
                    if (p.Name == textfield)
                    {
                        if (!ht.ContainsKey("text"))
                        {
                            ht["text"] = value;
                        }
                    }
                    if (p.Name == iconfield)
                    {
                        if (!ht.ContainsKey("icon"))
                        {
                            ht["icon"] = iconroot + value;
                        }
                    }
                    if (p.Name == idfield)
                    {
                        if (!ht.ContainsKey("id"))
                        {
                            ht["id"] = value;
                        }
                    }

                    ht[key] = value;

                }
                list.Add(ht);
            }

            return list;
        }

        #region extjs 所属的json方法 王皓 2014-03-08
        /// <summary>
        /// 获取树形Grid JSON
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <param name="idfield"></param>
        /// <param name="pidfield"></param>
        /// <returns></returns>
        public static string GetTreeGridJSONForExt<T>(IEnumerable<T> data, string idfield, string pidfield,string leaffield)
        {
            if (data == null)
                return null;
            string json = ToJson(ArrayToTreeDataForExttreeGrid(IEnumToHash<T>(data), idfield, pidfield, leaffield));
            //json = @"[{""text"":""."",""children"":" + json+ "}]";

            return json;
        }
        /// <summary>
        /// 将IList转化为树格式对象
        /// </summary>
        /// <param name="list">线性数据</param>
        /// <param name="id">ID的字段名</param>
        /// <param name="pid">PID的字段名</param>
        /// <returns></returns>
        public static object ArrayToTreeDataForExttreeGrid(IList<Hashtable> list, string id, string pid,string leafid)
        {
            var h = new Hashtable(); //数据索引 
            var r = new List<Hashtable>(); //数据池,要返回的 
            foreach (var item in list)
            {
                if (!item.ContainsKey(id)) continue;
                h[item[id].ToString()] = item;
               
            }
            foreach (var item in list)
            {
                //extjs前台树状结构必有的属性
                if (!item.ContainsKey("leaf"))
                    item["leaf"] = item[leafid];
                
               
                if (!item.ContainsKey(id)) continue;
                //如果item不包含PID字段或PID字段为null 或 则判断为父节点
                if (!item.ContainsKey(pid) || item[pid] == null)
                {
                    
                    r.Add(item);
                }
                else
                {
                    //PID对应的节点在数据集合中找不到 则不添加此节点至树
                    if (!h.ContainsKey(item[pid].ToString())) continue;
                    var pitem = h[item[pid].ToString()] as Hashtable;
                    if (!pitem.ContainsKey("children"))
                        pitem["children"] = new List<Hashtable>();
                    var children = pitem["children"] as List<Hashtable>;

                    
                    children.Add(item);
                }
                
            }
            return r;
        }


        /// <summary>
        /// 获取树形Grid JSON--菜单权限管理
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <param name="idfield"></param>
        /// <param name="pidfield"></param>
        /// <param name="isDefaultCheck">是否默认选中具有权限的菜单</param>
        /// <returns></returns>
        public static string GetTreeGridJSONForExt<T>(IEnumerable<T> data, string idfield, string pidfield, string leaffield, List<string> listMenuPrivilege)
        {
            if (data == null)
                return null;
            string json = ToJson(ArrayToTreeDataForMenuPrivilege(IEnumToHash<T>(data), idfield, pidfield, leaffield, listMenuPrivilege));
            //json = @"[{""text"":""."",""children"":" + json+ "}]";

            return json;
        }
        /// <summary>
        /// 将IList转化为树格式对象--菜单权限管理
        /// </summary>
        /// <param name="list">线性数据</param>
        /// <param name="id">ID的字段名</param>
        /// <param name="pid">PID的字段名</param>
        /// <param name="leafid">是否根节点对应的字段</param>
        /// <param name=param name="listMenyPrivilege"></param>
        /// <returns></returns>
        public static object ArrayToTreeDataForMenuPrivilege(IList<Hashtable> list, string id, string pid, string leafid, List<string> listMenuPrivilege)
        {
            var h = new Hashtable(); //数据索引 
            var r = new List<Hashtable>(); //数据池,要返回的 
            foreach (var item in list)
            {
                if (!item.ContainsKey(id)) continue;
                h[item[id].ToString()] = item;

            }
            foreach (var item in list)
            {
                //extjs前台树状结构必有的属性
                if (!item.ContainsKey("leaf"))
                    item["leaf"] = item[leafid];

                //extjs前台树状结构必有的属性 如果没有check则添加默认false
                if (!item.ContainsKey("checked"))
                    item["checked"] = false;
                //循环改变被选中状态
                foreach (string strfor in listMenuPrivilege)
                {
                    if (strfor == item[id].ToString())
                    {
                        item["checked"] = true;
                        break;
                    }
                }
                if (!item.ContainsKey(id)) continue;
                //如果item不包含PID字段或PID字段为null 或 则判断为父节点
                if (!item.ContainsKey(pid) || item[pid] == null)
                {

                    r.Add(item);
                }
                else
                {
                    //PID对应的节点在数据集合中找不到 则不添加此节点至树
                    if (!h.ContainsKey(item[pid].ToString())) continue;
                    var pitem = h[item[pid].ToString()] as Hashtable;
                    if (!pitem.ContainsKey("children"))
                        pitem["children"] = new List<Hashtable>();
                    var children = pitem["children"] as List<Hashtable>;


                    children.Add(item);
                }

            }
            return r;
        }
      
        #endregion

    }
}
