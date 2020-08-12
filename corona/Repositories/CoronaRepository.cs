using corona.db;
using corona.Entities;
using corona.Models;
using corona.Repositories.Interfaces;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace corona.Repositories
{

    public class CoronaRepository : BaseRepository<CoronaRecord>, ICoronaRepository
    {


        public CoronaRepository(IDbContext context) : base(context)
        {
        }

        public Task<CoronaRecord> GetOne(string code, int timeLineLimit)
        {
            IMongoQueryable<CoronaRecord> query = GetCoronaQuery(cr => cr.Id == code, timeLineLimit);
            return query.FirstOrDefaultAsync();
        }


        public Task<List<CoronaRecord>> GetAll(int timeLineLimit)
        {
            IMongoQueryable<CoronaRecord> query = GetCoronaQuery(cr => true, timeLineLimit);
            return query.ToListAsync();
        }


        public async Task<CoronaRecord> GetWorldRecord(int limit)
        {
            var query = Collection.AsQueryable()
                .SelectMany(cr => cr.Timeline, (cr, tr) => new
                {
                    cr.Id,
                    cr.Country,
                    Timeline = new
                    {
                        Date = DateTime.Parse(tr.Date),
                        tr.Cases,
                        tr.Deaths,
                        tr.Recovered
                    }
                })
                .GroupBy(item => item.Timeline.Date, (key, items) => new
                {
                    _id = key.ToString("%Y-%m-%d"),
                    Cases = items.Sum(item => item.Timeline.Cases),
                    Deaths = items.Sum(item => item.Timeline.Deaths),
                    Recovered = items.Sum(item => item.Timeline.Recovered)
                })
                .OrderByDescending(item => item._id)
                .Take(limit);




            var res = await query.ToListAsync();

            return new CoronaRecord
            {
                Id = "WW",
                Country = "Worldwide",
                Timeline = res.Select(item => new TimelineRecord
                {
                    Date = item._id,
                    Cases = item.Cases,
                    Deaths = item.Deaths,
                    Recovered = item.Recovered,
                })
            };
        }

        public Task UpdateTimelineRecord(string code, TimelineRecord record)
        {

            var filter = Builders<CoronaRecord>.Filter.Eq(cr => cr.Id, code);
            var updateBuilder = Builders<CoronaRecord>.Update;

            var models = new WriteModel<CoronaRecord>[]
            {
                new UpdateOneModel<CoronaRecord>(filter,
                updateBuilder.PullFilter(cr => cr.Timeline, tr => tr.Date == record.Date)),

                new UpdateOneModel<CoronaRecord>(filter,
                updateBuilder.Push(cr => cr.Timeline, record))

            };

            return Collection.BulkWriteAsync(models);

        }
        private IMongoQueryable<CoronaRecord> GetCoronaQuery(Expression<Func<CoronaRecord, bool>> filter, int limit)
        {
            return Collection.AsQueryable()
                .Where(filter)
                .SelectMany(cr => cr.Timeline, (cr, tr) => new
                {
                    cr.Id,
                    cr.Country,
                    Timeline = new
                    {
                        Date = DateTime.Parse(tr.Date),
                        tr.Cases,
                        tr.Deaths,
                        tr.Recovered
                    }
                })
                .OrderByDescending(unwindRes => unwindRes.Timeline.Date)
                .GroupBy(item => item.Id, (key, items) => new
                {
                    Id = key,
                    items.First().Country,
                    Timeline = items.Select(item => new TimelineRecord
                    {
                        Date = item.Timeline.Date.ToString("%Y-%m-%d"),
                        Cases = item.Timeline.Cases,
                        Deaths = item.Timeline.Deaths,
                        Recovered = item.Timeline.Recovered,
                    })
                })
                .Select(item => new CoronaRecord
                {
                    Id = item.Id,
                    Country = item.Country,
                    Timeline = item.Timeline.Take(limit)
                });
        }
    }
}
