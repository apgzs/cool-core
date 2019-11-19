import { Controller, Context } from 'egg';
import router from '../router';
import { Brackets } from 'typeorm';

// 返回参数配置
interface ResOp {
    // 返回数据
    data?: any;
    // 是否成功
    isFail?: boolean;
    // 返回码
    code?: number;
    // 返回消息
    message?: string;
}

// 分页参数配置
interface PageOp {
    // 模糊查询字段
    keyWordLikeFields?: string[];
    // where
    where?: Brackets;
    // 全匹配 "=" 字段
    fieldEq?: string[];
    // 排序
    addOrderBy?: {};
}

/**
 * 控制器基类
 */
export abstract class BaseController extends Controller {
    protected entity;
    protected OpService;
    protected pageOption: PageOp;

    protected constructor (ctx: Context) {
        super(ctx);
        this.OpService = this.service.comm.data;
        this.init();
    }

    /**
     * 初始化
     */
    protected init () {
    }

    /**
     * 设置服务
     * @param service
     */
    protected setService (service) {
        this.OpService = service;
    }

    /**
     * 配置分页查询
     * @param option
     */
    protected setPageOption (option: PageOp) {
        this.pageOption = option;
    }

    /**
     * 设置操作实体
     * @param entity
     */
    protected setEntity (entity) {
        this.entity = entity;
    }

    /**
     * 获得query请求参数
     */
    protected getQuery () {
        return this.ctx.request.query;
    }

    /**
     * 获得body请求参数
     */
    protected getBody () {
        return this.ctx.request.body;
    }

    /**
     * 分页查询数据
     */
    @router.get('/page')
    protected async page () {
        const result = await this.OpService.page(this.getQuery(), this.pageOption, this.entity);
        this.res({ data: result });
    }

    /**
     * 数据列表
     */
    @router.get('/list')
    protected async list () {
        const result = await this.OpService.list(this.entity);
        this.res({ data: result });
    }

    /**
     * 信息
     */
    @router.get('/info')
    protected async info () {
        const result = await this.OpService.info(this.getQuery().id, this.entity);
        this.res({ data: result });
    }

    /**
     * 新增
     */
    @router.post('/add')
    protected async add () {
        await this.OpService.add(this.getBody(), this.entity);
        this.res();
    }

    /**
     * 修改
     */
    @router.post('/update')
    protected async update () {
        await this.OpService.update(this.getBody(), this.entity);
        this.res();
    }

    /**
     * 删除
     */
    @router.post('/delete')
    protected async delete () {
        await this.OpService.delete(this.getBody().ids, this.entity);
        this.res();
    }

    /**
     * 返回数据
     * @param op 返回配置，返回失败需要单独配置
     */
    protected res (op?: ResOp) {
        if (!op) {
            this.ctx.body = {
                code: 1000,
                message: 'success',
            };
            return;
        }
        if (op.isFail) {
            this.ctx.body = {
                code: op.code ? op.code : 1001,
                data: op.data,
                message: op.message ? op.message : 'fail',
            };
        } else {
            this.ctx.body = {
                code: op.code ? op.code : 1000,
                message: op.message ? op.message : 'success',
                data: op.data,
            };
        }
    }

}
