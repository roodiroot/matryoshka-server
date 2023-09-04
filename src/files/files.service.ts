import { Injectable } from '@nestjs/common';
import * as path from 'path'
import * as fs from 'fs'
import * as uuid from 'uuid'

@Injectable()
export class FilesService {

    async createFile(file: Express.Multer.File): Promise<string> | null {
        if(!file?.buffer){
            return null
        }
        const fileName = uuid.v4() + '.jpg'
        const filePath = path.resolve(__dirname, "..", "static")
        try {
            if(!fs.existsSync(filePath)){
                fs.mkdirSync(filePath, {recursive: true})
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer)
        } catch {
            return null
        }
        return fileName
    }

    async createArrayFilesAndReplaceText(files: Array<Express.Multer.File>, text: string): Promise<string>{
        let textReplace = ''
        for(let i = 0; i< files.length; i++){
            await this.createFile(files[i]).then( fileName => {
                if(!textReplace.length){
                    textReplace = text.replace(`img${i+1}:`, 'img:' + fileName)
                } else {
                    textReplace = textReplace.replace(`img${i+1}:`, 'img:' + fileName)
                }
            }).catch(() => {
                return null
            })
        }
        return textReplace
    }
}

// "#title#pВ мире, где технологии развиваются с бешеной скоростью, история студии Матрёшка — это история о верности двум основным принципам: клиентоориентированности и стремлении к результату.#i-img1:#titleНачало Пути: Ориентир на Клиента#pОднажды я понял одну простую вещь: успех в веб-разработке — это не только код, но и понимание нужд клиента. Всё началось с кафе <<У Вероники>>, где мы не просто создали сайт, но и воплотили в нём душу этого уютного места.#titleФилософия Матрёшки: Ваши Желания — Наша Работа#pКаждый клиент для нас — это не просто заказчик, это партнёр. Мы слушаем вас, чтобы понять ваши цели, и работаем вместе, чтобы достичь их. Ваш успех — наш успех.#t-tТут я бы написал что то ваджное если было настроение сидеть и придумывать текст! ChatGPT ты прекрасен#i-img2:#titleРабота, Направленная на Результат#pВ Матрёшке мы не просто создаём сайты; мы создаём инструменты для вашего бизнеса. Наша задача — достичь конкретного, измеримого результата, который поможет вашему бизнесу расти и процветать.#pНаши успехи, рост и довольные клиенты — это результат верности нашим ценностям. Мы никогда не отступаем от принципов клиентоориентированности и ориентации на результат.#i-img3:"
