using corona.db;
using corona.Entities;
using corona.Models;
using corona.Repositories.Interfaces;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using MongoDB.Driver.Core.Operations;
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

        private static readonly String _worldID = "WW";

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
            IMongoQueryable<CoronaRecord> query = GetCoronaQuery(cr => cr.Id != _worldID, timeLineLimit);
            return query.ToListAsync();
        }


        public Task<CoronaRecord> GetWorldRecord(int limit)
        {
            //var query = Collection.AsQueryable()
            //    .SelectMany(cr => cr.Timeline, (cr, tr) => new
            //    {
            //        cr.Id,
            //        cr.Country,
            //        Timeline = new
            //        {
            //            Date = DateTime.Parse(tr.Date),
            //            tr.Cases,
            //            tr.Deaths,
            //            tr.Recovered
            //        }
            //    })
            //    .GroupBy(item => item.Timeline.Date, (key, items) => new
            //    {
            //        _id = key.ToString("%Y-%m-%d"),
            //        Cases = items.Sum(item => item.Timeline.Cases),
            //        Deaths = items.Sum(item => item.Timeline.Deaths),
            //        Recovered = items.Sum(item => item.Timeline.Recovered)
            //    })
            //    .OrderByDescending(item => item._id)
            //    .Take(limit);



            return GetOne(_worldID, limit);


        }

        public async Task UpdateTimelineRecord(string code, TimelineRecord record)
        {

            //var filter = Builders<CoronaRecord>.Filter.Eq(cr => cr.Id, code);
            //var updateBuilder = Builders<CoronaRecord>.Update;

            //var models = new WriteModel<CoronaRecord>[]
            //{
            //    new UpdateOneModel<CoronaRecord>(filter,
            //    updateBuilder.PullFilter(cr => cr.Timeline, tr => tr.Date == record.Date)),

            //    new UpdateOneModel<CoronaRecord>(filter,
            //    updateBuilder.Push(cr => cr.Timeline, record))

            //};

            //return Collection.BulkWriteAsync(models);


            try
            {
                var updateBuilder = Builders<CoronaRecord>.Update;
                var filter = Builders<CoronaRecord>.Filter.Eq(cr => cr.Id, code);

                var oldRecord = await Collection.FindOneAndUpdateAsync(filter,
                    updateBuilder.PullFilter(cr => cr.Timeline, tr => tr.Date == record.Date));
                await Collection.UpdateOneAsync(filter, updateBuilder.Push(cr => cr.Timeline, record));


                var worldRecord = await Collection.FindOneAndUpdateAsync(cr => cr.Id == _worldID,
                    updateBuilder.PullFilter(cr => cr.Timeline, tr => tr.Date == record.Date));

                var latestWorldTimeLine = worldRecord.Timeline
                    .Where(tr => DateTime.Parse(tr.Date) <= DateTime.Parse(record.Date))
                    .Max();

                var latestRecordTimeline = oldRecord.Timeline
                    .Where(tr => DateTime.Parse(tr.Date) <= DateTime.Parse(record.Date))
                    .Max();


                await Collection.UpdateOneAsync(cr => cr.Id == _worldID, updateBuilder.Push(cr => cr.Timeline, new TimelineRecord
                {
                    Date = record.Date,
                    Cases = latestWorldTimeLine.Cases + (record.Cases - latestRecordTimeline.Cases),
                    Deaths = latestWorldTimeLine.Deaths + (record.Deaths - latestRecordTimeline.Deaths),
                    Recovered = latestWorldTimeLine.Recovered + (record.Recovered - latestRecordTimeline.Recovered),
                }));

            }
            catch (Exception e)
            {
                Console.WriteLine("Error writing to MongoDB: " + e.Message);
                throw;
            }

        }


        private IMongoQueryable<CoronaRecord> GetCoronaQuery(Expression<Func<CoronaRecord, bool>> filter, int limit)
        {
            return Collection.AsQueryable()
                .Where(filter)
                .SelectMany(cr => cr.Timeline, (cr, tr) => new
                {
                    cr.Id,
                    cr.Country,
                    cr.Points,
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
                    items.First().Points,
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
                    Points = item.Points,
                    Timeline = item.Timeline.Take(limit)
                });
        }
    }
}
