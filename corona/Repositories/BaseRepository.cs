using corona.db;
using corona.Entities;
using corona.Models;
using corona.Repositories.Interfaces;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;

namespace corona.Repositories
{
    public abstract class BaseRepository<T> : IBaseRepository<T>
    {
        protected IDbContext Context { get; }
        protected IMongoCollection<T> Collection { get; }

        public BaseRepository(IDbContext context)
        {
            Context = context;
            Collection = context.GetCollection<T>(GetCollectionName());
        }

        public Task Insert(T data)
        {
            return Collection.InsertOneAsync(data);
        }

        public Task InsertMany(IEnumerable<T> data)
        {
            return Collection.InsertManyAsync(data);
        }

        private static string GetCollectionName()
        {
            return typeof(T).GetTypeInfo().GetCustomAttribute<BsonCollectionAttribute>(false).CollectionName;
        }


    }
}
