using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace corona.Repositories.Interfaces
{
    public interface IBaseRepository<T>
    {
        public Task Insert(T data);
        public Task InsertMany(IEnumerable<T> data);


    }
}

