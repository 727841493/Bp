using System.Collections.Generic;

namespace Bp.Utils
{
    public class PagedResult<T> : IEnumerable<T>, ICollection<T>
    {

        public static readonly PagedResult<T> Empty = null;

        public int TotalRecords { get; set; }

        public int TotalPages { get; set; }

        public int PageSize { get; set; }

        public int PageNumber { get; set; }

        public List<T> Data { get; set; }


        public PagedResult()
        {
            Data = new List<T>();
        }

        public PagedResult(int totalRecords, int totalPages, int pageSize, int pageNumber, List<T> data)
        {
            this.TotalRecords = totalRecords;
            this.TotalPages = totalPages;
            this.PageSize = pageSize;
            this.PageNumber = pageNumber;
            this.Data = data;
        }


        #region IEnumerable<T> 成员

        public IEnumerator<T> GetEnumerator()
        {
            return Data.GetEnumerator();
        }

        #endregion

        #region IEnumerable 成员

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return Data.GetEnumerator();
        }

        #endregion

        #region ICollection<T> 成员

        public void Add(T item)
        {
            this.Data.Add(item);
        }

        public void Clear()
        {
            this.Data.Clear();
        }

        public bool Contains(T item)
        {
            return Data.Contains(item);
        }

        public void CopyTo(T[] array, int arrayIndex)
        {
            Data.CopyTo(array, arrayIndex);
        }

        public int Count
        {
            get { return Data.Count; }
        }

        public bool IsReadOnly
        {
            get { return false; }
        }

        public bool Remove(T item)
        {
            return Data.Remove(item);
        }

        #endregion
    }
}
