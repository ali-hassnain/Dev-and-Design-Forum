export interface Post {
    identifier : string
    title : string
    slug : string
    subName : string
    createdAt : string
    updatedAt : string
    body?:string
    username:string
    //virtual fields
    url:string
    voteScore?:number
    commentCount?:number
    userVote?:number
} 
export interface userpost{
    created_at: string
    updated_at: string
    name: string
    title: string
    description: string
    imageUrn: string
    bannerUrn: string
    username: string
    posts: string
    //virtuals
    imageUrl: string
    bannerUrl: string
    postCOunt?: number
}

export interface Comment{
    identifier: string
    body:string
    username: string
    //virtuals
    userVote:number
    voteScore:number

}