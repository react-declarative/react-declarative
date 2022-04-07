
## Компонент `Autosizer`

>  Компонент представляет собой контейнер, который автоматически подстраивается под размеры родительского компонента. Не дает содержимому вылезти за края контейнера.
Придает рдительскому компоненту `position: relative`, `overlow: hidden`. А для ребенка устанавливает значение `position: absolute`. И растягивает его на всю ширину и высоту. 

Например: 

```tsx
<div style={{width: "30em", height: "30em"}}>
    <AutoSizer>
      {({ width, height }) => (
        <img style={{height: height, width: width}} src="https://cdnn21.img.ria.ru/images/156087/28/1560872802_0:680:1536:1832_1920x0_80_0_0_13851eec92ec40195a70b46caeba8116.jpg" alt="cat" />          
      )}
    </AutoSizer>
</div>
```

Принимает в себя `height` и `width`, которые можно передать как пропсы дальше. ДОЛЖЕН иметь родительский компонент, в котором будут заданы размеры. Удобен при необходимости вставить изображене, видео, svg, `canvas`, и тп.

>`Autosizer` может заменить медиазапорсы.

Для этого понадобится хук `useTheme()`, например, из библиотеки Material UI. `breakpoints` - точки перехода размеров экрана. Например, стандартно `sm` = 600px (можно изменить). Затем устанавливам условия и для каждого условия возвращаем нужный нам компонент, который будет подходить для мобольной или десктопной версии и тп.  

```tsx
import { useTheme } from "@mui/material";
import { AutoSizer } from "react-declarative";
import ISize from "react-declarative/model/ISize";
import NavBar from "../../components/navigation";
import DesctopView from "./views/Desktop";
import TabletView from "./views/TabletView";
import MobileView from "./views/MobileView";

export const HomePage = () => {
  const {
          breakpoints: {
              values: {
                  lg,
                  md,
                  sm,
                  xl,
                  xs,
              }
          }
      } = useTheme();

  const renderContent = ({ width }: ISize) => {
      if (width < sm) {
          return (
              <MobileView/>
          )
      } else if (width < md && width > sm) {
          return (
              <TabletView/>
          )
      } else {
          return (
              <DesctopView/>
          )
      }
  };

  return (
      <div>
          <NavBar/>
          {/* Ниже запрашиваем ширину от контейнера и высоту от общего окна для Автосайзера, чтоб он считал от этих данных. Здесть мы это делаем, т.к. у нас нет родительского компонента с установленной шириной и высотой */}
          <AutoSizer heightRequest={() => window.innerHeight - 80} target={document.body} selector='.MuiContainer-root'>
              {renderContent}
          </AutoSizer>
      </div>
      
  )
}
export default HomePage;
```
Стандартно `Autosizer` растягитвается сверху вниз, но можно изменить направление на обратное путем добавления пропса `closest`. Например `closest='.MuiContainer-root'>`.


Изначально подстраивает под размеры без учета `border`. Для того, чтобы содержимое отображалось внутри с учетом `border`, необходимо прописать:

```tsx
const borderWidth = 2
<AutoSizer heightRequest={(h) => h - 2 * borderWidth} widthRequest={(w) => w - 2 * borderWidth}>
    ...
</AutoSizer>
```
, где borderWidth - ширина `border`.


### keepFlow 

Позволяет вылезти за границы контейнера. Т.е. по дефолту содержимое оборачивается в контейнер (

```tsx
  container: {
    position: 'absolute',
    minWidth: '100%',
    minHeight: '100%',
    top: 0,
    left: 0,
  }
```
), но если прописать свойство `<AutoSizer keepFlow>`, то этого не будет.